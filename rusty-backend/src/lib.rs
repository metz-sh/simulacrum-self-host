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

// pub use common::settings::settings;
pub use common::settings::*;

use domains::UrlDomain;
use repositories::RepositoryManager;
#[derive(Clone, FromRef, Debug)]
pub struct AppState {
    pub repository_manager: RepositoryManager,
    pub settings: Settings,
    pub urls_domain: UrlDomain,
}