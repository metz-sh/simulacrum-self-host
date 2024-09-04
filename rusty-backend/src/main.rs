use rusty_backend::{
    repositories::RepositoryManager, routing_setup::setup_router, settings, AppState
};
use tracing::info;
fn main() {
    tokio::runtime::Builder::new_multi_thread()
    .enable_all()
    .build()
    .unwrap()
    .block_on(async {
        async_main().await
    })
}

// #[tokio::main]
async fn async_main() {
    let settings = settings().clone();
    let port = settings.server.port;
    let app_state = AppState {
        repository_manager: RepositoryManager::new(&settings).await.unwrap(),
        settings,
    };

    if app_state.settings.run_migrations.unwrap_or(false) {
    	sqlx::migrate!().run(app_state.repository_manager.db()).await.expect("Couldn't run migrations!");
     	info!("Successfully applied db migrations!");
    }

    let router = setup_router(app_state.clone()).with_state(app_state.clone());
    info!("Using config {:#?}", app_state);


    let listener = tokio::net::TcpListener::bind(format!(
        "0.0.0.0:{}",
        port
    ))
    .await
    .unwrap();

    info!("Started server on: {}", port);

    axum::serve(listener, router).await.unwrap();
}
