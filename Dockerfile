Here's the content of /mnt/user-data/outputs/Dockerfile with line numbers:
     1	# Multi-stage build for optimized image size
     2	
     3	# Stage 1: Build the application
     4	FROM node:20-alpine AS builder
     5	
     6	WORKDIR /app
     7	
     8	# Copy package files
     9	COPY package*.json ./
    10	
    11	# Install dependencies
    12	RUN npm ci
    13	
    14	# Copy source code
    15	COPY . .
    16	
    17	# Build the application
    18	RUN npm run build
    19	
    20	# Stage 2: Serve with nginx
    21	FROM nginx:alpine
    22	
    23	# Copy built assets from builder stage
    24	COPY --from=builder /app/dist /usr/share/nginx/html
    25	
    26	# Copy nginx configuration (optional - see nginx.conf file)
    27	# COPY nginx.conf /etc/nginx/conf.d/default.conf
    28	
    29	# Expose port 80
    30	EXPOSE 80
    31	
    32	# Start nginx
    33	CMD ["nginx", "-g", "daemon off;"]