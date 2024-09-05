# Leveraging the pre-built Docker images with
# cargo-chef and the Rust toolchain
FROM lukemathwalker/cargo-chef:0.1.66-rust-slim-bookworm AS chef
WORKDIR app


FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
RUN apt-get update
RUN apt-get -y install libssl-dev pkg-config libpkgconf3 pkgconf pkgconf-bin
# Build dependencies - this is the caching Docker layer!
RUN cargo chef cook --release --recipe-path recipe.json
# Build application
COPY . .
RUN cargo build --release --bin rusty-backend

# We do not need the Rust toolchain to run the binary!
FROM debian:trixie-slim AS runtime
WORKDIR app
RUN apt-get update
RUN apt-get -y install openssl libssl-dev ca-certificates curl
COPY --from=builder /app/target/release/rusty-backend /usr/local/bin
EXPOSE 3117
ENTRYPOINT ["/usr/local/bin/rusty-backend"]
