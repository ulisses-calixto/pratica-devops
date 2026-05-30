create table "Usuarios"(
    "id" serial primary key,
    "nome" varchar(255) not null,
    "email" varchar(255) unique not null
);

create table "Favoritos"(
    "id_usuario" integer not null,
    "id_produto" integer not null,
    primary key("id_usuario", "id_produto"),
    constraint "favoritos_id_usuario_foreign" foreign key("id_usuario") references "Usuarios"("id") on delete cascade
)