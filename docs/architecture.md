# QuickNotes System Architecture

## 1. Functional requirements

* Users can register and authenticate.
* Users can create, read, update, and delete notes.
* Users can assign tags to notes.
* Users can search and paginate through their notes.
* The API validates inputs and returns meaningful errors.
* Users can access only their own private notes.

## 2. Non-functional requirements

* Availability target: 99.9% per month.
* Performance target: 95% of normal reads complete within 300 ms.
* Security: HTTPS, secure password hashing, authentication, and authorization.
* Scalability: application servers can scale horizontally.
* Reliability: backups, monitoring, and recovery procedures.
* Maintainability: clear API contracts, automated tests, and structured logs.

These are initial design targets that should be validated through testing.

## 3. Load estimate for one million users

### Assumptions

1. Total registered users: 1,000,000.
2. Daily active users: 10%, or 100,000.
3. Each active user performs 100 reads and 10 writes per day.
4. Traffic is averaged over 86,400 seconds per day.
5. Peak traffic is five times the average.
6. Each new note uses approximately 2 KB of raw storage.
7. Each active user creates 10 notes daily.

### Reads per second

Daily reads:

100,000 × 100 = 10,000,000 reads/day

Average reads per second:

10,000,000 ÷ 86,400 ≈ 116 reads/second

Peak reads per second:

116 × 5 ≈ 580 reads/second

### Writes per second

Daily writes:

100,000 × 10 = 1,000,000 writes/day

Average writes per second:

1,000,000 ÷ 86,400 ≈ 11.6 writes/second

Peak writes per second:

11.6 × 5 ≈ 58 writes/second

### Storage per year

Annual note count:

1,000,000 × 365 = 365,000,000 notes/year

Annual raw storage:

365,000,000 × 2 KB ≈ 730 GB/year

This estimate excludes database indexes, metadata, backups, replicas, and operational overhead. Actual storage needs depend on note size and retention policies.

### Read-heavy or write-heavy?

QuickNotes is read-heavy under these assumptions because it handles about ten reads for every write. Caching, database indexes, and read replicas can reduce read pressure on the primary database. Writes must still be validated and committed reliably.

## 4. Architecture diagram

                   [ Users / Browser ]
                           |
                         [ DNS ]
                           |
                     [ CDN / TLS ]
                           |
                    [ Load Balancer ]
                       /         \
                      v           v
               [ App Server 1 ] [ App Server 2 ]
                      |           |
                      +-----+-----+
                            |
                      [ Shared Cache ]
                            |
                    +-------+--------+
                    |                |
              [ Primary DB ] --> [ Read Replica ]

                    [ Queue ]
                        |
                        v
                    [ Worker ]

### Component responsibilities

* **Client:** provides the interface and sends API requests.
* **DNS:** resolves the service's domain name.
* **CDN:** delivers static files from nearby locations and reduces origin traffic.
* **Load balancer:** distributes requests and avoids routing traffic to unhealthy app servers.
* **App servers:** validate requests and execute application logic; multiple instances provide horizontal scaling.
* **Shared cache:** stores frequently requested data to reduce latency and database load.
* **Primary database:** stores authoritative records and handles writes.
* **Read replica:** serves suitable read queries and reduces pressure on the primary.
* **Queue:** buffers background jobs and separates secondary work from user-facing requests.
* **Worker:** processes queued jobs, such as notifications or exports.

The cache must not expose one user's private notes to another user. Cache keys must include the relevant user identity and query parameters.

## 5. GET /notes request flow

1. The client resolves the API hostname through DNS.
2. The client connects over HTTPS, and the request reaches the load balancer.
3. The load balancer forwards the request to a healthy app server.
4. The application validates the user's authentication token.
5. The application checks the shared cache for the user's note list.
6. If the cache misses, the application reads from the replica when appropriate, or from the primary when stronger consistency is required.
7. The application caches eligible results and returns paginated JSON.
8. The client safely renders the returned notes.

## 6. POST /notes request flow

1. The client submits the title and body as JSON over HTTPS.
2. The load balancer routes the request to a healthy app server.
3. The application authenticates the user and validates the title and body.
4. The application writes the new note to the primary database.
5. The application invalidates relevant cached note lists.
6. The application can enqueue non-critical work, such as a notification.
7. The API returns `201 Created` with the new note's ID and data.

## 7. Trade-offs

### Caching versus freshness

Caching improves read speed and reduces database load, but cached data may become stale. Use suitable expiration times and invalidate affected cache entries after writes.

### Read replicas versus consistency

Read replicas increase read capacity, but replication lag may cause recently created notes to appear late. Route read-after-write requests to the primary when necessary.

### More servers versus operational complexity

Multiple application servers improve availability and capacity, but increase monitoring and deployment complexity. Keep the servers stateless and health-checked.

### Queues versus immediate processing

Queues keep slow background work out of the main request path, but jobs may complete later and require retries. Use idempotent jobs and monitor failed tasks.

## 8. Avoiding single points of failure

Deploy multiple app servers behind a health-checking load balancer, preferably across separate failure domains. Use a highly available cache configuration, managed database high availability, automated backups, and tested recovery procedures. Configure monitoring and a documented database failover process.

A read replica alone does not guarantee automatic failover. The primary database remains a potential single point of failure unless high availability and failover are configured and tested.
