PRAGMA foreign_keys = OFF;

CREATE TABLE Cliente (
	"Cedúla_Cliente" varchar(255) PRIMARY KEY NOT NULL UNIQUE,
	Nombre varchar(255) NOT NULL,
	Apellido varchar(255) NOT NULL,
	Correo varchar(255) NOT NULL,
	ID_Rol varchar(255),
	Direcccion varchar(255) NOT NULL,
	FOREIGN KEY (ID_Rol) REFERENCES Rol(ID_Rol) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE INDEX Cliente_index_0 ON Cliente("Cedúla_Cliente");

CREATE TABLE Usuario (
	Cedula_Usuario varchar(255) PRIMARY KEY NOT NULL UNIQUE,
	Nombre varchar(255),
	Apellido varchar(255),
	Correo varchar(255),
	ID_Rol varchar(255),
	"Contraseña" varchar(255),
	Direccion varchar(255),
	FOREIGN KEY (ID_Rol) REFERENCES Rol(ID_Rol) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE Telefono (
	Id_Telefono integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
	Numero varchar(255) NOT NULL,
	Cedula_Cliente varchar(255) NOT NULL,
	Cedula_Usuario varchar(255),
	FOREIGN KEY (Cedula_Cliente) REFERENCES Cliente("Cedúla_Cliente") ON DELETE NO ACTION ON UPDATE NO ACTION,
	FOREIGN KEY (Cedula_Usuario) REFERENCES Usuario(Cedula_Usuario) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE Rol (
	ID_Rol varchar(255) PRIMARY KEY NOT NULL UNIQUE,
	Nombre_Rol varchar(255)
);

CREATE TABLE Direccion (
	ID_Direccion numeric PRIMARY KEY NOT NULL UNIQUE,
	Cardinalidad varchar(255),
	"Urbanización" varchar(255),
	Calle varchar(255),
	Casa varchar(255),
	Cedula_Usuario varchar(255),
	Cedula_Cliente varchar(255),
	FOREIGN KEY (Cedula_Usuario) REFERENCES Cliente("Cedúla_Cliente") ON DELETE NO ACTION ON UPDATE NO ACTION,
	FOREIGN KEY (Cedula_Cliente) REFERENCES Usuario(Cedula_Usuario) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE Producto (
	ID_Producto varchar(255) PRIMARY KEY NOT NULL UNIQUE,
	Nombre_Prodcuto varchar(255),
	Descripcion_Producto varchar(255),
	Tipo_Producto integer,
	Precio_Producto double,
	FOREIGN KEY (Tipo_Producto) REFERENCES Tipo(id_Tipo) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE Stock (
	ID_Stock varchar(255) PRIMARY KEY NOT NULL UNIQUE,
	ID_Producto varchar(255),
	Cantidad numeric,
	Fecha_Movimiento datetime,
	Tipo_Movimiento varchar(255),
	FOREIGN KEY (ID_Producto) REFERENCES Producto(ID_Producto) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE Proveedor (
	id integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE
);

CREATE TABLE Detalle_Venta (
	ID_Detalle_Venta integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
	ID_venta integer,
	ID_Prodcuto varchar(255),
	cantidad integer,
	Precio_Producto decimal,
	FOREIGN KEY (ID_Prodcuto) REFERENCES Producto(ID_Producto) ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE Venta (
	ID_Venta integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
	ID_Producto varchar(255),
	Cantidad_producto integer,
	Fecha_hora datetime,
	Cedula_Cliente varchar(255),
	Metodo_Pago integer,
	FOREIGN KEY (ID_Venta) REFERENCES Detalle_Venta(ID_Detalle_Venta) ON DELETE NO ACTION ON UPDATE NO ACTION,
	FOREIGN KEY (Cedula_Cliente) REFERENCES Cliente("Cedúla_Cliente") ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE TABLE Tipo (
	id_Tipo integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
	Tipo_Producto varchar(255)
);

CREATE TABLE "Tipo de pago" (
	ID_Tipo_Pago integer PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE,
	Nombre_Tipo_Pago varchar(255),
	ID_venta integer,
	FOREIGN KEY (ID_venta) REFERENCES Venta(ID_Venta) ON DELETE NO ACTION ON UPDATE NO ACTION
);

PRAGMA foreign_keys = ON;