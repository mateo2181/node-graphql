-- Base de datos: `db_books`

--
-- Estructura de tabla para la tabla `Authors`
--

CREATE TABLE `Authors` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `description` varchar(5000) NOT NULL,
  `image` varchar(255) NOT NULL,
  `nationality` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Books`
--

CREATE TABLE `Books` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` varchar(5000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `authorId` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `Users`
--

CREATE TABLE `Users` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Índices para tablas volcadas
--
ALTER TABLE `Authors` ADD PRIMARY KEY (`id`);
ALTER TABLE `Books` ADD PRIMARY KEY (`id`), ADD KEY `authorId` (`authorId`);
ALTER TABLE `Users` ADD PRIMARY KEY (`id`);

ALTER TABLE `Authors` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `Books` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `Users` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `Books` ADD CONSTRAINT `Books_ibfk_1` FOREIGN KEY (`authorId`) REFERENCES `Authors` (`id`);

COMMIT;
