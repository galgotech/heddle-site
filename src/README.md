
Heddle is a declarative, statically-typed language designed for orchestrating data workflows. It provides a functional data-flow syntax (pipelines) to compose and manage imperative logic (steps).

Its core purpose is to separate the flow of data from the implementation of tasks, enabling the construction of resilient, testable, and high-performance data systems. It is not a general-purpose programming language; it is a high-level orchestration and glue language that runs on a dedicated, high-performance columnar runtime.

## Core Principles

1. **Functional Orchestration**: Workflows are defined as functional pipelines. Data flows immutably from one step to the next.
2. **Imperative Implementation**: Individual units of work (I/O, business logic) are abstracted into step definitions, which are implemented in a host language (e.g., Python, Go, Rust) and compiled to WebAssembly.
3. **Declarative Data Flow**: You define the relationships between steps, not the execution order. Heddle's runtime compiles this into an optimized Directed Acyclic Graph (DAG) for concurrent execution.
4. **First-Class Data Transformation**: Data shaping (filtering, joining, aggregating) is a native language feature via embedded PRQL blocks.
5. **Static Typing**: Data integrity is enforced at compile-time. All data flowing between steps must conform to a defined schema.

## Language Constructs

### 1\. `import`

Imports an external module (containing `step` implementations) and binds it to a local identifier.

```heddle
import "fhub/http" as http
import "std/database" as db
```

### 2\. `schema`

A `schema` defines a named data contract. It specifies the "shape" (columns and types) of data. All `step` inputs and outputs are type-checked against these schemas.

* **Primitive Types**: `int`, `string`, `float`, `bool`, `timestamp`
* **Complex Types**: Nested `schema` definitions (structs) are supported.

```heddle
schema User = {
  id: int,
  username: string,
  active: bool
}

schema DetailedUser = {
  user_info: User,
  last_login: timestamp
}
```


### 3\. `step`

A `step` is the atomic unit of work in Heddle. It is a named wrapper around an imperative function (the "module reference"). It defines its input and output data contracts.

* `step` [identifier]
* `[input_type]?`: Optional. The schema of the data this step expects. If omitted, it takes no input from the pipeline.
* `[output_type]`: The schema of the data this step produces.
* `= [module_reference]`: The implementation (e.g., http.get, db.query).
* `[dict]`: A static configuration block passed to the module.

```heddle
// A step with no input that produces data
step fetch_users -> User = http.get {
  url: "[https://api.example.com/users](https://api.example.com/users)"
}

// A step that takes data, processes it, and returns data
step validate_user User -> User = my_logic.validate {
  min_length: 4
}
```

### 4\. `handler`

A `handler` is a special type of `step` used for declarative error handling. It is a dedicated pipeline that executes only if the step it's attached to fails.

* It's `input_type` must match the `input_type` of the step it handles.
* It's `output_type` must match the `output_type` of the step it handles (allowing it to provide a default/fallback value) or a generic Error schema.

```heddle
// A handler that logs the error and returns an empty User dataframe
handler log_and_swallow User -> User = error.log_and_return {
  message: "Failed to process user, swallowing error.",
  return_value: []
}
```

### 5\. `workflow`

A `workflow` is the primary execution entry point. It defines a graph of `step` executions using a pipeline-based syntax.

* **Global Error Handler**: A workflow can define a global error handler using `? [handler_identifier]`.
* **Pipelines (`|`)**: The pipe operator `|` passes the output of the previous step as the input to the next step.
* **Error Handling (`?`)**: The ? operator attaches a local handler to a step. If `my_step` fails, `my_handler` is executed instead. Its output is then passed down the pipeline.
* **PRQL Blocks**: PRQL code can be placed directly in a pipeline, enclosed in `(...)`. The data from the previous step is available as the input table.

```heddle
workflow login_flow ? global_error_handler {
  // A simple pipeline
  fetch_users
    | validate_user ? log_and_swallow // Attach local handler
    | (
        from input
        filter active == true
        select username
      )
    | log.info
}
```

### 6\. `let` Bindings

Within a `workflow`, `let` binds the result of a pipeline to a named identifier. This allows for:

* **Branching**: Using a single data source for multiple, independent pipelines.
* **Joining**: Referencing the result of a previous pipeline in a PRQL block.

```heddle
workflow process_users {
  // 1. Fetch data once
  let all_users = fetch_users

  // 2. Branch A: Process active users
  all_users
    | (from input filter active == true)
    | db.write_active

  // 3. Branch B: Process inactive users
  all_users
    | (from input filter active == false)
    | db.write_inactive
}
```

### 7\. Data Primitives

Heddle's configuration blocks and future `dataframe` literals use standard data primitives.

* Dictionaries: `{ key: "value", number: 123 }`
* Lists: `[ "a", "b", "c" ]`
* Pimitives: `string`, `number`, `bool`, `null`


## Example: Full Workflow

This example defines schemas, imports logic, and creates a workflow that fetches users, filters them with PRQL, and logs the result.

```heddle
// 1. Imports
import "fhub/http" as http
import "std/log" as log
import "std/error" as error

// 2. Schemas
schema User = {
  id: int,
  username: string,
  active: bool
}

schema Username = {
  username: string
}

// 3. Steps
step fetch_all_users -> User = http.get {
  url: "[https://api.example.com/users](https://api.example.com/users)"
}

step log_usernames Username -> Username = log.info {
  message: "Processed users"
}

// 4. Error Handler
handler handle_fetch_error -> User = error.log_and_return {
  message: "Failed to fetch users. Returning empty list.",
  return_value: [] // Returns an empty User dataframe
}

// 5. Workflow
workflow get_active_users {
  fetch_all_users ? handle_fetch_error
    | (
        from input
        filter active == true
        select username
      )
    | log_usernames
}
```