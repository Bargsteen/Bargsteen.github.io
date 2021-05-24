---
title: "Testing Gophercise 1"
date: 2019-03-10T21:23:57+01:00
draft: true
categories: ["code"]
---

I recently started programming in Go via [The Tour of Go](http://tour.golang.org/) and I was delighted to find it fun and easy to get in to. Go is a perfect example of how powerful simplicity can be.
After learning the basics, including the very interesting concurrency primitives, I decided to look for projects to build and luckily stumbled upon [Gophercises](http://gophercises.com), which is a free set of tutorials based on Go, where you build small, but realistic and useful, projects and thereafter can watch a professional Go-programmer code the same project. After completing [the first exercise, where you build a quiz game](https://gophercises.com/exercises/quiz), I decided to try and test the code as a way of learning testing in Go. It should be stated that I do not have a great deal of experience in testing code (and none in Go so far), but am currently taking a course on testing and verification. The goal of this post will therefore be to further my knowledge of testing in Go, and in general, whilst explaining it to whomever might read this.

## The Starting Point: 0% Test Coverage
To make it easier for others to follow, we will base the tests upon the [official solution provided by the creator of Gophercises](https://github.com/gophercises/quiz/tree/solution-p2). And as an indicator of our progress, we will use the [Go Cover Tool](https://blog.golang.org/cover).  Obviously, we start out at 0% coverage. But we will soon make amends to that number,  hopefully arriving at a 100% without too many alterrations to the code.

Once a test file is created, which needs the suffix `_text` i.e. the tests for `main.go` are expected to be in the file `main_test.go`, you can check the test coverage. This is done by running the command `go test -cover`.

``` go
package main

import (
	“encoding/csv”
	“flag”
	“fmt”
	“os”
	“strings”
	“time”
)

func main() {
	csvFilename := flag.String(“csv”, “problems.csv”, “a csv file in the format of ‘question,answer’”)
	timeLimit := flag.Int(“limit”, 30, “the time limit for the quiz in seconds”)
	flag.Parse()

	file, err := os.Open(*csvFilename)
	if err != nil {
		exit(fmt.Sprintf(“Failed to open the CSV file: %s\n”, *csvFilename))
	}
	r := csv.NewReader(file)
	lines, err := r.ReadAll()
	if err != nil {
		exit(“Failed to parse the provided CSV file.”)
	}
	problems := parseLines(lines)

	timer := time.NewTimer(time.Duration(*timeLimit) * time.Second)
	correct := 0

problemloop:
	for i, p := range problems {
		fmt.Printf("Problem #%d: %s = ", i+1, p.q)
		answerCh := make(chan string)
		go func() {
			var answer string
			fmt.Scanf(“%s\n”, &answer)
			answerCh <- answer
		}()

		select {
		case <-timer.C:
			fmt.Println()
			break problemloop
		case answer := <-answerCh:
			if answer == p.a {
				correct++
			}
		}
	}

	fmt.Printf(“You scored %d out of %d.\n”, correct, len(problems))
}

func parseLines(lines [][]string) []problem {
	ret := make([]problem, len(lines))
	for i, line := range lines {
		ret[i] = problem{
			q: line[0],
			a: strings.TrimSpace(line[1]),
		}
	}
	return ret
}

type problem struct {
	q string
	a string
}

func exit(msg string) {
	fmt.Println(msg)
	os.Exit(1)
}
```


## First Unittest
Let’s get our feet wet with the `parseLines` function. It should be relatively simple, as it is a pure function (i.e. it has no side-effects). Okay, so first of all we need to import the `testing` library, and all of our testing functions will take `*testing.T` as the sole input. If you have experience with testing in something like Python or Java, you’ll notice the lack of the `assert` keyword. This is done purposefully by the creators of Go to make writing testcode more similar to regular code. Instead of asserts you use regular if-statements together with some of the functions from the testing library. Here is the first version of the test for the `parseLines` function:

``` go
package main

import "testing"

func TestParseLines(t *testing.T) {
  tables := []struct {
  input    [][]string
  expected []problem
  }{
    {
      input:    [][]string{{“1 + 2”, “3”}, {“4 / 2”, “2”}},
      expected: []problem{problem{q: “1 + 2”, a: “3”}, problem{q: “4 / 2”, a: “2”}},
  },
  {
      input:    [][]string{{“10 % 3”, “1”}, {“( 100 * 2 ) / 4”, “50”}},
      expected: []problem{problem{q: “10 % 3”, a: “1”}, problem{q: “( 100 * 2 ) / 4”, a: “50”}},
  },
  }

  for _, table := range tables {
    actual := parseLines(table.input)
    if len(table.expected) != len(actual) {
      t.Fatal(“Failed to parse all lines.”)
    }

    for i, a := range actual {
      if a != table.expected[i] {
        t.Errorf(“The following line caused problems with parsing: %v”, table.input[i])
      }
    }
  }
}
```

I used test tables to allow for easily adding more test cases in the future, similar to how  [theories work in something like xUnit](https://xunit.github.io/docs/getting-started/netcore/cmdline#write-first-theory). As with the lack of assertions, this approach relies only on regular language constructs such as lists and structs. It brings our test-coverage up to 12.5%, but I see a possibility of runtime-errors; what happens if you pass in the following input? `[][]string{{“4 / 2”}}`. It causes a panic, because `parseLines` assumes the inner lists to have a length of two. `parseLines` should therefore return an `([]problem, error)` tuple instead, and we will have to alter the code and the tests.
``` go
var errProblemFormat = errors.New(“invalid problem format”)

func parseLines(lines [][]string) ([]problem, error) {
  ret := make([]problem, len(lines))
  for i, line := range lines {
    if len(line) != 2 {
      return nil, errProblemFormat
    }
    ret[i] = problem{
      q: line[0],
      a: strings.TrimSpace(line[1]),
    }
  }
  return ret, nil
}
```
To handle the possibility of errors, the `main` function now checks whether the returned error from `parseLines` is nil.
The final tests

``` go
func TestParseLines(t *testing.T) {
  tables := []struct {
    input         [][]string
    shouldSucceed bool
    expected      []problem
  }{
    {
      input:         [][]string{{“1 + 2”, “3”}, {“4 / 2”, “2”}},
      shouldSucceed: true,
      expected:      []problem{problem{q: “1 + 2”, a: “3”}, problem{q: “4 / 2”, a: “2”}},
    },
    {
      input:         [][]string{{“10 % 3”, “1”}, {“( 100 * 2 ) / 4”, “50”}},
      shouldSucceed: true,
      expected:      []problem{problem{q: “10 % 3”, a: “1”}, problem{q: “( 100 * 2 ) / 4”, a: “50”}},
    },
    {
      input:         [][]string{{“10 % 3”, “1”}, {“( 100 * 2 ) / 4”}},
      shouldSucceed: false,
      expected:      nil,
    },
  }

  for _, table := range tables {
    actual, err := parseLines(table.input)

    // Valid, but fails
    if table.shouldSucceed && err != nil {
      t.Errorf(“Failed to parse all lines: %v”, table)
    }

    for i, a := range actual {
      if a != table.expected[i] {
        t.Errorf(“The following line was parsed incorrectly: %v”, table.input[i])
      }
    }
  }
}
```
According to the cover tool, this alteration brings us up to 16.7% test coverage due to the increased length of the function under test.
## Breaking Main Apart
Rather than testing the `main` function in its current, bulky, state I decided to refactor it a bit. Primarily to bring out the non-trivial parts.
``` go
func main() {
  csvFilename := flag.String("csv", "problems.csv", "a csv file in the format of 'question,answer'")
  timeLimit := flag.Int("limit", 30, "the time limit for the quiz in seconds")
  flag.Parse()

  file, err := os.Open(*csvFilename)
  if err != nil {
    exit(fmt.Sprintf("Failed to open the CSV file: %s\n", *csvFilename))
  }
  r := csv.NewReader(file)
  lines, err := r.ReadAll()
  if err != nil {
    exit("Failed to read the provided CSV file.")
  }
  problems, err := parseLines(lines)
  if err != nil {
    exit("Failed to parse one of the lines in the CSV file.")
  }
  correct, total := runQuiz(os.Stdin, os.Stdout, problems, *timeLimit)
  printResult(os.Stdout, correct, total)
}

func runQuiz(r io.Reader, w io.Writer, problems []problem, timeLimit int) (correct, total int) {
  timer := time.NewTimer(time.Duration(timeLimit) * time.Second)
  total = len(problems)

problemloop:
  for i, p := range problems {
    fmt.Fprintf(w, "Problem #%d: %s = ", i+1, p.q)
    answerCh := make(chan string)
    go getAndSendAnswer(answerCh, r)

    select {
    case <-timer.C:
      fmt.Fprintln(w)
      break problemloop
    case answer := <-answerCh:
      if answer == p.a {
        correct++
      }
    }
  }
  return correct, total
}

func printResult(w io.Writer, correct, total int) {
  fmt.Fprintf(w, "You scored %d out of %d.\n", correct, total)
}

func getAndSendAnswer(answerCh chan string, r io.Reader) {
  var answer string
  fmt.Fscanf(r, "%s\n", &answer)
  answerCh <- answer
}
```
Aside from extracting some of the functionality, I removed the direct use of standard in and out, which `fmt.Printf` and friends rely on. Instead we use the related `fmt.Fprintf` and `fmt.Fscanf` functions which take in an `io.Writer` and `io.Reader`, respectively. When used in the program, we can pass in `os.stdout` and `os.stdin`, and during tests we can choose to give it something completely different. The use of interfaces in Go is common because they are very flexible. The key difference between interfaces in Go and fx C# is that you don’t have to specify which interfaces you implement when creating the data structures (would be classes in C#). Instead, if functions exist for a given data structure, which adheres to an interface—even one you /just/ created—then the data structure implements that interface!

Okay, back to testing; how do we proceed? `parseLines` was rather trivial, as it was a pure function without concurrency. `getAndSendAnswer` is the exact opposite, but it turns out to be easy to test due to its reliance on its inputs. We can fake the userinput using `strings.NewReader` and listen on the channel, just like the caller in actual code would.
``` go
func TestGetAndSendAnswer(t *testing.T) {
  answerCh := make(chan string)
  go getAndSendAnswer(answerCh, strings.NewReader(“42\n43\n”))
  if msg := <-answerCh; msg != “42” {
    t.Errorf(“received incorrect answer from channel”)
  }
}
```
The newline characters (`\n`) are important, as the `fmt.Fscanf` call in `runQuiz` expects it between each answer. Notice the `go` keyword before `getAndSendAnswer`; I forgot it the first time around which caused a deadlock. The lesson learned: when testing functions used a goroutines, remember to also use the `go` keyword in your tests, as the results might be completely different.

And now for the final part that I decided to test. The `runQuiz` function. Since it deals with a `Timer`, I had to create my own `Reader` type, which sleeps in between reads. It could definitely have been achieved in a different and more elegant fashion, which wouldn’t delay the execution of the tests, but this will serve for now. It is basically a wrapper around the `strings.NewReader`:
``` go
type slowReader struct {
  r     io.Reader
  delay int
}

func (sr slowReader) Read(b []byte) (int, error) {
  n, err := sr.r.Read(b)
  time.Sleep(time.Duration(sr.delay) * time.Second)
  return n, err
}

func makeSlowReader(text string, delay int) slowReader {
  return slowReader{r: strings.NewReader(text), delay: delay}
}
```

Once again, I use test tables to check multiple cases. Oh, and `io.Discard` is an implementation of `io.Writer` which throws everything written to it, as we don’t need it for the tests.
``` go
func TestRunQuiz(t *testing.T) {
  tables := []struct {
    readerText      string
    problems        []problem
    expectedCorrect int
    timeLimit       int
    readerDelay     int
  }{
    {
      "3\n2\n",
      []problem{problem{q: "1 + 2", a: "3"}, problem{q: "4 / 2", a: "2"}},
      2, 3, 0,
    },
    {
      "2\n1\n",
      []problem{problem{q: "1 + 2", a: "3"}, problem{q: "4 / 2", a: "2"}},
      0, 2, 0,
    },
    {
      "  3  \n  2  \n",
      []problem{problem{q: "1 + 2", a: "3"}, problem{q: "4 / 2", a: "2"}},
      2, 5, 0,
    },
    {
      "3\n2\n",
      []problem{problem{q: "1 + 2", a: "3"}, problem{q: "4 / 2", a: "2"}},
      1, 3, 1,
    },
    {
      "3\n2\n",
      []problem{problem{q: "1 + 2", a: "3"}, problem{q: "4 / 2", a: "2"}},
      0, 1, 2,
    },
  }

  for i, tt := range tables {
    actualCorrect, _ := runQuiz(makeSlowReader(tt.readerText, tt.readerDelay), ioutil.Discard, tt.problems, tt.timeLimit)
    if actualCorrect != tt.expectedCorrect {
      t.Errorf("Failed on table %d. Expected: %d. Actual: %d", i, tt.expectedCorrect, actualCorrect)
    }
  }
}
```

The final test coverage is on 53.8% which is due to the lack of tests on `main`, but given the nature of the code I deem it satisfying. Something else which is satisfying, is the /heat map/ you can generate of your code based on the test coverage.
::TODO INSERT IMAGE::
It gives you clear insights into which lines are tested, and how thoroughly, which is very cool indeed.

## What did we learn?
To round this post of, let’s reflect a bit on what we learned. 

<ul>
<li> How to create and execute basic tests in Go</li>
<li> How to use test tables in tests</li>
<li> How to test goroutines</li>
<li> How to refactor code reliant on `stdin` / `stdout` into testable code reliant on the `Reader` / `Writer` interfaces</li>
<li> How to test time-dependent code</li>
</ul>

I definitely learned something from testing this gophercise and explaining it in this post, and I hope you learned something as well!

Happy testing
-Kasper
