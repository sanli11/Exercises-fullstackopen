# Part 6 - Sequence Diagram for Notes SPA with User Adds New Note

<br>

```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa
    activate server
    server-->>browser: HTML document containing the Form
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: the css file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    activate server
    server-->>browser: the JavaScript file
    deactivate server

    Note right of browser: The browser starts executing the JavaScript code that fetches the JSON from the server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{ "content": "HTML is easy", "date": "2023-1-1" }, ... ]
    deactivate server

    Note right of browser: The browser executes the callback function that renders the notes

    Note right of browser: The user enters new note in the form field and clicks save button

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note right of browser: Sends a POST request with the JSON containing the note and the timestamp with its header Content-type set to 'application/json'
    
    server->>browser: Server responds with HTTP status code 302 to do a new GET
    deactivate server
    Note left of server: Server responds with a HTTP status code 201

    Note right of browser: The spa.js also pushes the new note into the array containing other notes from data.json
```
