#![allow(
    private_interfaces
)]


use axum::extract::FromRef;
mod constants;

mod common;
pub mod domains;
pub mod repositories;
pub mod routes;
pub mod routing_setup;

pub use common::settings::*;

use repositories::RepositoryManager;
#[derive(Clone, FromRef, Debug)]
pub struct AppState {
    pub repository_manager: RepositoryManager,
    pub settings: Settings,
}
