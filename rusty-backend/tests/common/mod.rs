use std::env::{self, VarError};

use rusty_backend::{db_settings::DbSettings, repositories::RepositoryManager, settings, AppState, Settings};
use testcontainers_modules::{postgres::Postgres, testcontainers::{runners::AsyncRunner, ContainerAsync, RunnableImage}};

// Shouldn't be dropped!
#[allow(dead_code)]
pub struct Crockery {
    postgres_container: ContainerAsync<Postgres>,
}

pub struct TestContext {
    pub app_state: AppState,
    pub settings: Settings,
    pub crockery: Crockery,
    pub mock_server_host: String,
}

impl TestContext {
    pub async fn new() -> Self {
        let container = create_postgres().start().await;
        let connection_string = format!(
            "postgres://postgres:postgres@127.0.0.1:{}/metz",
            container.get_host_port_ipv4(5432).await
        );
        let original_settings = settings().clone();
        let new_settings = Settings {
            db: DbSettings { url: connection_string, ..original_settings.db },
            ..settings().clone()
        };

        let rm = RepositoryManager::new(&new_settings).await.expect("Unable to create test database :(");

        sqlx::migrate!().run(rm.db()).await.expect("Couldn't run migrations on test database :(");

        let app_state = AppState {
            settings: new_settings.clone(),
            repository_manager: rm,
        };

        Self {
            app_state,
            settings: new_settings,
            crockery: Crockery { postgres_container: container },
            mock_server_host: parse_mock_server_url(),
        }
    }

}


pub fn create_postgres() -> RunnableImage<Postgres> {
    RunnableImage::from(Postgres::default().with_db_name("metz")).with_tag("16.2")
}

pub fn parse_mock_server_url() -> String {
    if let Ok(url) = env::var("MOCK_SERVER_URL") as Result<String, VarError> {
        return url;
    }
    let port: String = env::var("MOCK_SERVER_PORT").unwrap_or("9000".to_string());
    format!("http://localhost:{}", port)
}
