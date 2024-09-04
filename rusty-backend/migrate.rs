use rusty_backend::{repositories::RepositoryManager, settings};


#[tokio::main]
async fn main() {
    let rm = RepositoryManager::new(settings()).await.expect("Couldn't run migrations!");
    sqlx::migrate!().run(rm.db()).await.expect("Couldn't run migrations!");
}
