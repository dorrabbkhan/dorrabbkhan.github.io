---
layout: post
title: "Rust for the Python dev: shifting your mental model"
description: "Moving from Python to Rust means unlearning runtime habits - the compiler forces explicit error handling and memory safety, buying you predictable, high-throughput infrastructure code."
date: 2026-06-29
---

**TL;DR:** Moving from Python to Rust requires a complete rewiring of how you think about memory, concurrency, and error handling. The real benefit of Rust in cloud infrastructure is not only raw speed, but the absolute predictability of a strict, compiler-driven architecture.

Moving from Python to Rust feels less like learning a new language and more like unlearning bad habits. You don't just swap out `def` for `fn` and carry on. You have to fundamentally change how you reason about memory boundaries, state mutations, and what actually constitutes a "safe" concurrent operation.

When I was working on migrating a legacy codebase from Python 2.7 to modern Python 3.8, the mental model was entirely runtime-dependent. You write the logic, write the tests, push to staging, and inevitably discover a handful of untangled errors that slipped through.

Contrast that with my experience engineering high-throughput microservices from scratch with Rust. The strict, compiler-driven discipline of Rust forces you to confront every possible failure state before the code even compiles. It is a massive hurdle at first, but it completely changes your operational baseline long-term.

## Beyond Raw Speed

We all know Rust is incredibly fast. But when you are designing systems, raw compute speed is only one piece of the puzzle. The real game-changers for high-throughput cloud messaging are memory safety and predictable concurrency.

In Python, spinning up a thread pool to process an SQS queue is syntactically easy, but ensuring thread-safe state sharing is a constant battle against the Global Interpreter Lock and subtle race conditions. In Rust, if your concurrency model is flawed, the compiler simply refuses to build it.

## The Compile-Time Shift

Let's look at a minimal example of polling an AWS SQS queue. In a traditional Python approach, you might wrap a `boto3` call in a broad `try/except` block. Rust forces a much safer paradigm:

```rust
use aws_sdk_sqs::{Client, Error};

async fn poll_sqs_queue(client: &Client, queue_url: &String) -> Result<(), Error> {
    let receive_message_output = client
        .receive_message()
        .queue_url(queue_url)
        .max_number_of_messages(10)
        .send()
        .await?; // The '?' forces explicit error propagation

    // Rust forces us to handle the Option explicitly. No implicit NoneTypes.
    if let Some(messages) = receive_message_output.messages() {
        for msg in messages {
            if let Some(body) = msg.body() {
                println!("Processing message payload: {}", body);
                // Pipeline logic goes here
            }
        }
    } else {
        println!("Queue empty, gracefully backing off.");
    }

    Ok(())
}

```

Notice the heavy reliance on `Result` and `Option` types. There are no null pointers or runtime exceptions lurking in the pipeline. You are forced to explicitly acknowledge that a message body might not exist, or that the network call might fail.

This shift from runtime hope to compile-time guarantees is a steep hill to climb. But once you rewire your mental model to satisfy the borrow checker, the anxiety of deploying asynchronous cloud infrastructure virtually disappears.
