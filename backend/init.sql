CREATE TABLE "Usuarios"(
    "id" SERIAL PRIMARY KEY,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE "Favoritos"(
    "id_usuario" INTEGER NOT NULL,
    "id_produto" INTEGER NOT NULL,
    PRIMARY KEY("id_usuario", "id_produto"),
    CONSTRAINT "favoritos_id_usuario_foreign" FOREIGN KEY("id_usuario") REFERENCES "Usuarios"("id") ON DELETE CASCADE
)