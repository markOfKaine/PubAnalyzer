## Annotate and Save PDF - `Sequence`
> This Sequence shows how annotations are retrieved + reapplied to a users previously downloaded PubMed Article.
> Any steps related to retrieving a new document will not be covered.
>
> *See:* [Fetch PubMed Articles](./pdfRetrievalSequence.md) for Sequence to retrieve PDF from PubMed.

### Save Annotations -
```mermaid
sequenceDiagram
    actor User
    participant UI as UI<br/>(React)
    participant Server as Server<br/>(Django)
    participant DB

    User->>UI: Saves Annotations
    UI->>Server: post /annotations/{user_id}/{pmc_id}/<br/>{annotation_object}

    Note over Server: Django verifies user

    Server->>DB: Save User's Annotation
    DB->>Server: Result
    
    alt Annotation saved
        Server->>UI: 201 Created<br/>{annotation_id}
        UI->>UI: Create Success Notification
        UI->>User: Show saved annotation
    else Save failed
        Server->>UI: Error Code<br/>{error_message}
        UI->>User: Display error
    end
```

### Retrieve Annotations - 
```mermaid
sequenceDiagram
    actor User
    participant UI as UI<br/>(React)
    participant Server as Server<br/>(Django)
    participant DB

    User->>UI: Opens Previously Annotated PDF
    UI->>Server: get /annotations/{user_id}/{pmc_id}/

    Note over Server: Django verifies user

    Server->>DB: Get User's Annotation
    DB->>Server: Result
    
    alt Annotations retrieved
        Server->>UI: 200 Success<br/>{annotation_id}
        UI->>UI: Get Coords for Annotation<br/>Apply Annotations
        UI->>User: Display PDF w/annotation
    else No Annotations
        Server->>UI: 200 Success<br/>
        UI->>User: Display PDF
    else Retrieval failed
        Server->>UI: Error Code<br/>{error_message}
        UI->>User: Display error
    end
```
