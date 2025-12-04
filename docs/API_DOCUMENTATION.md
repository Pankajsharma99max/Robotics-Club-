# API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-backend-url.com/api
```

## Authentication

All admin routes require JWT token in header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/login
Login to admin panel
```json
Request:
{
  "email": "admin@roboticsclub.com",
  "password": "admin123"
}

Response:
{
  "_id": "...",
  "username": "admin",
  "email": "admin@roboticsclub.com",
  "role": "Admin",
  "token": "eyJhbGc..."
}
```

#### POST /auth/register (Admin Only)
Create new admin user
```json
Request:
{
  "username": "newadmin",
  "email": "new@roboticsclub.com",
  "password": "password123",
  "role": "Editor"
}
```

#### GET /auth/me (Protected)
Get current user info

#### PUT /auth/password (Protected)
Update password

---

### Events

#### GET /events
Get all events
```
Query Params:
- type: Workshop|Hackathon|Competition|Guest Lecture
- upcoming: true|false
```

#### GET /events/:id
Get single event

#### POST /events (Protected)
Create event
```
Form Data:
- title: string
- description: string
- date: ISO date
- type: string
- banner: file (optional)
- schedulePDF: file (optional)
- registrationLink: string (optional)
- venue: string (optional)
```

#### PUT /events/:id (Protected)
Update event

#### DELETE /events/:id (Protected)
Delete event

---

### Team

#### GET /team
Get all team members
```
Query Params:
- category: Core|Mentor|Technical|Design
```

#### POST /team (Protected)
Create team member
```
Form Data:
- name: string
- role: string
- category: string
- image: file
- bio: string (optional)
- socialLinks: JSON string
```

---

### Achievements

#### GET /achievements
Get all achievements
```
Query Params:
- category: Award|Competition|Project|Publication
```

#### POST /achievements (Protected)
Create achievement
```
Form Data:
- title: string
- description: string
- date: ISO date
- category: string
- images: files[] (max 10)
- certificates: files[] (max 5)
- externalLinks: JSON string
```

---

### Gallery

#### GET /gallery
Get all gallery images
```
Query Params:
- category: Robotics Projects|Workshops|Hackathons|Hardware Lab|Other
```

#### POST /gallery (Protected)
Upload images (batch)
```
Form Data:
- images: files[] (max 20)
- category: string
- caption: string (optional)
```

---

### Home Content

#### GET /home
Get home page content

#### PUT /home (Protected)
Update home content
```
Form Data:
- heroTitle: string
- heroSubtitle: string
- heroBackground: file (optional)
- stats: JSON string {members, projects, awards, workshops}
- model3DSettings: JSON string
```

---

### Announcements

#### GET /announcements
Get active announcements (public)

#### GET /announcements/all (Protected)
Get all announcements

#### POST /announcements (Protected)
Create announcement
```json
{
  "title": "string",
  "content": "string",
  "priority": "Low|Medium|High",
  "expiryDate": "ISO date"
}
```

---

### Settings

#### GET /settings
Get site settings (public)

#### PUT /settings (Protected, Admin Only)
Update settings
```
Form Data:
- clubName: string
- logo: file (optional)
- themeColors: JSON string
- socialLinks: JSON string
- contactInfo: JSON string
```

---

## Error Responses

```json
{
  "message": "Error description"
}
```

Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error
