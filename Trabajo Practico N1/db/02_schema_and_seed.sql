CREATE TABLE IF NOT EXISTS usuarios_utn (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(20) NOT NULL UNIQUE,
    clave VARCHAR(20) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    bloqueado CHAR(1) NOT NULL DEFAULT 'N'
);

INSERT INTO usuarios_utn (usuario, clave, apellido, nombre, bloqueado)
VALUES
    ('mjmartinez', '123456', 'MARTINEZ', 'Maria Jose', 'N'),
    ('rcsiri', '123456', 'SIRI', 'Rocio Cecilia', 'N'),
    ('mfsilvestre', '123456', 'SILVESTRE', 'Maria Florencia', 'N'),
    ('apessina', '123456', 'PESSINA', 'Alcides Norman', 'N'),
    ('mesposito', '123456', 'ESPOSITO', 'Marcela Liliana', 'Y')
ON DUPLICATE KEY UPDATE id = id;
