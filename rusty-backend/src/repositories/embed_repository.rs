use sqlx::{query_as, PgExecutor};
use time::PrimitiveDateTime;
use uuid::Uuid;

use super::{pg, RepositoryResponse};

pub struct Embed {
    pub id: i32,
    pub embed_id: Uuid,
    pub project_id: i32,
    pub created_at: PrimitiveDateTime,
    pub updated_at: PrimitiveDateTime,
}

impl Embed {
    pub async fn find_by_id(
        id: i32,
        executor: pg!(),
    ) -> RepositoryResponse<Option<Embed>> {
        query_as!(Embed, "select * from embeds where id = $1", id)
            .fetch_optional(executor)
            .await
    }

    pub async fn find_by_embed_id(
        embed_id: Uuid,
        executor: pg!(),
    ) -> RepositoryResponse<Option<Embed>> {
        query_as!(
            Embed,
            "select * from embeds where embed_id = $1",
            embed_id,
        )
        .fetch_optional(executor)
        .await
    }

    pub async fn find_by_project_id(
        project_id: i32,
        executor: pg!(),
    ) -> RepositoryResponse<Option<Embed>> {
        query_as!(
            Embed,
            "select * from embeds where project_id = $1",
            project_id,
        )
        .fetch_optional(executor)
        .await
    }

    pub async fn create(
        project_id: i32,
        executor: pg!(),
    ) -> RepositoryResponse<Embed> {
        query_as!(
            Embed,
            "INSERT into embeds(project_id) VALUES($1) RETURNING *",
            project_id,
        )
        .fetch_one(executor)
        .await
    }
}
