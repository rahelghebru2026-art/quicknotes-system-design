# QuickNotes Architecture & Scaling Plan

## Requirements

### Functional Requirements
- Users can create, read, update, and delete notes.
- Users can organize notes with tags.
- Users can view a paginated list of their notes.

### Non-Functional Requirements
- **High Availability:** 99.9% uptime SLA.
- **Low Latency:** Read operations under 100ms globally; write operations under 200ms.
- **Scalability:** Capable of supporting 1 million active users with robust traffic spikes.

---

## Load Estimates (1 Million Active Users)
- **Active Users (DAU):** 1,000,000
- **Writes per Second (Create Note):** Assuming each active user creates an average of 5 notes per day across 86,400 seconds:
  $$\frac{1,000,000 \times 5}{86,400} \approx 57.87 \text{ writes/sec}$$
(~58 writes/sec)
- **Reads per Second (List/View Notes):** Assuming each active user views their notes 40 times per day:
  $$\frac{1,000,000 \times 40}{86,400} \approx 462.96 \text{ reads/sec}$$
(~463 reads/sec)
- **Storage per Year:** Assuming an average note size of 2 KB (including title, body, and metadata) and 5 million new notes created daily:
  $$5,000,000 \text{ notes/day} \times 2 \text{ KB} = 10,000,000 \text{ KB/day} \approx 10 \text{ GB/day}$$
  $$10 \text{ GB/day} \times 365 \text{ days} \approx 3.65 \text{ TB/year}$$

---

## Architecture Diagram

```text
[ Clients (Web / Mobile) ]
           │
           ▼
        [ DNS ] (Route53 / Geo-DNS)
           │
           ▼
      [ CDN ] (Cloudflare / CloudFront - Static Assets)
           │
           ▼
  [ Load Balancer ] (Nginx / ALB - SSL Termination & Traffic Distribution)
           │
           ├──────────────────────────────┐
           ▼                              ▼
    [ App Server 1 ]               [ App Server 2 ]
           │                              │
           ├───────────┬──────────────────┼───────────────┐
           ▼           ▼                  ▼               ▼
     [ Redis Cache ] [ Primary DB ] [ Read Replica ] [ Message Queue ]
                            ▲             │               │
                            │             ▼               ▼
                            └─────── [ PostgreSQL ] [ Background Workers ]