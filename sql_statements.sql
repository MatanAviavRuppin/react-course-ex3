USE [master]
GO
/****** Object:  Database [cgroup98_dish]    Script Date: 07/01/2023 16:39:52 ******/
CREATE DATABASE [cgroup98_dish]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'dish', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\dish.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'dish_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL15.SQLEXPRESS\MSSQL\DATA\dish_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT
GO
ALTER DATABASE [cgroup98_dish] SET COMPATIBILITY_LEVEL = 150
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [cgroup98_dish].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [cgroup98_dish] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [cgroup98_dish] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [cgroup98_dish] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [cgroup98_dish] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [cgroup98_dish] SET ARITHABORT OFF 
GO
ALTER DATABASE [cgroup98_dish] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [cgroup98_dish] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [cgroup98_dish] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [cgroup98_dish] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [cgroup98_dish] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [cgroup98_dish] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [cgroup98_dish] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [cgroup98_dish] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [cgroup98_dish] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [cgroup98_dish] SET  DISABLE_BROKER 
GO
ALTER DATABASE [cgroup98_dish] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [cgroup98_dish] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [cgroup98_dish] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [cgroup98_dish] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [cgroup98_dish] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [cgroup98_dish] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [cgroup98_dish] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [cgroup98_dish] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [cgroup98_dish] SET  MULTI_USER 
GO
ALTER DATABASE [cgroup98_dish] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [cgroup98_dish] SET DB_CHAINING OFF 
GO
ALTER DATABASE [cgroup98_dish] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [cgroup98_dish] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [cgroup98_dish] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [cgroup98_dish] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [cgroup98_dish] SET QUERY_STORE = OFF
GO
USE [cgroup98_dish]
GO
/****** Object:  Table [dbo].[Ingredients]    Script Date: 07/01/2023 16:39:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ingredients](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](15) NOT NULL,
	[image] [varchar](255) NOT NULL,
	[calories] [float] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[IngredientsInRecipe]    Script Date: 07/01/2023 16:39:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[IngredientsInRecipe](
	[recipeId] [int] NOT NULL,
	[ingredientId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[recipeId] ASC,
	[ingredientId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Recipes]    Script Date: 07/01/2023 16:39:52 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Recipes](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](40) NOT NULL,
	[image] [varchar](255) NOT NULL,
	[cookingMethod] [varchar](40) NOT NULL,
	[time] [float] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Ingredients] ON 

INSERT [dbo].[Ingredients] ([id], [name], [image], [calories]) VALUES (1, N'Broccoli', N'https://www.health.harvard.edu/media/content/images/p7_Broccoli_HH1812_gi905351392.jpg', 34)
INSERT [dbo].[Ingredients] ([id], [name], [image], [calories]) VALUES (2, N'Pasta Barilla', N'https://e-kosher.gr/656-home_default/penne-rigate-barilla-500gr.jpg', 110)
INSERT [dbo].[Ingredients] ([id], [name], [image], [calories]) VALUES (3, N'Tomato Sauce', N'https://www.barilla.com//-/media/images/he_il/products/il-products/arrabietta/productsaucesnew250x230.png?la=he-IL', 40)
INSERT [dbo].[Ingredients] ([id], [name], [image], [calories]) VALUES (4, N'Basil', N'https://st1.foodsd.co.il/Images/Products/large/N7lOLNKTHa.jpg', 5)
INSERT [dbo].[Ingredients] ([id], [name], [image], [calories]) VALUES (6, N'Meat', N'https://media.istockphoto.com/id/505207430/photo/fresh-raw-beef-steak.jpg?s=612x612&w=0&k=20&c=QxOege3Io4h1TNJLtGYh71rxb29p1BfFcZvCipz4WVY=', 150)
INSERT [dbo].[Ingredients] ([id], [name], [image], [calories]) VALUES (1007, N'Salt', N'https://acs-h.assetsadobe.com/is/image//content/dam/cen/97/web/2/LN-saltshaker.jpg/?$responsive$&wid=300&qlt=90,0&resMode=sharp2', 0)
SET IDENTITY_INSERT [dbo].[Ingredients] OFF
GO
INSERT [dbo].[IngredientsInRecipe] ([recipeId], [ingredientId]) VALUES (2, 2)
INSERT [dbo].[IngredientsInRecipe] ([recipeId], [ingredientId]) VALUES (2, 3)
INSERT [dbo].[IngredientsInRecipe] ([recipeId], [ingredientId]) VALUES (2, 4)
INSERT [dbo].[IngredientsInRecipe] ([recipeId], [ingredientId]) VALUES (3, 1)
INSERT [dbo].[IngredientsInRecipe] ([recipeId], [ingredientId]) VALUES (3, 3)
INSERT [dbo].[IngredientsInRecipe] ([recipeId], [ingredientId]) VALUES (3, 4)
INSERT [dbo].[IngredientsInRecipe] ([recipeId], [ingredientId]) VALUES (5, 2)
INSERT [dbo].[IngredientsInRecipe] ([recipeId], [ingredientId]) VALUES (5, 3)
INSERT [dbo].[IngredientsInRecipe] ([recipeId], [ingredientId]) VALUES (5, 4)
INSERT [dbo].[IngredientsInRecipe] ([recipeId], [ingredientId]) VALUES (5, 6)
INSERT [dbo].[IngredientsInRecipe] ([recipeId], [ingredientId]) VALUES (6, 4)
INSERT [dbo].[IngredientsInRecipe] ([recipeId], [ingredientId]) VALUES (6, 6)
INSERT [dbo].[IngredientsInRecipe] ([recipeId], [ingredientId]) VALUES (6, 1007)
INSERT [dbo].[IngredientsInRecipe] ([recipeId], [ingredientId]) VALUES (9, 6)
INSERT [dbo].[IngredientsInRecipe] ([recipeId], [ingredientId]) VALUES (9, 1007)
GO
SET IDENTITY_INSERT [dbo].[Recipes] ON 

INSERT [dbo].[Recipes] ([id], [name], [image], [cookingMethod], [time]) VALUES (2, N'Italian Pasta', N'https://food.fnr.sndimg.com/content/dam/images/food/fullset/2021/02/05/Baked-Feta-Pasta-4_s4x3.jpg.rend.hgtvcom.406.325.suffix/1615916524567.jpeg', N'Cooking', 40)
INSERT [dbo].[Recipes] ([id], [name], [image], [cookingMethod], [time]) VALUES (3, N'Italian Pizza', N'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F19%2F2014%2F07%2F10%2Fpepperoni-pizza-ck-x.jpg&q=60', N'Bake', 10)
INSERT [dbo].[Recipes] ([id], [name], [image], [cookingMethod], [time]) VALUES (5, N'Italian Bolognese', N'https://anitalianinmykitchen.com/wp-content/uploads/2019/09/bolognese-sauce-600-1-of-1.jpg', N'Cooking', 90)
INSERT [dbo].[Recipes] ([id], [name], [image], [cookingMethod], [time]) VALUES (6, N'Kebab', N'https://www.sweetandsavourypursuits.com/wp-content/uploads/2022/07/Kafta-Kebabs-1200-%C3%97-1200-px.jpg', N'Roasting', 34)
INSERT [dbo].[Recipes] ([id], [name], [image], [cookingMethod], [time]) VALUES (9, N'Shawarma', N'https://www.closetcooking.com/wp-content/uploads/2021/09/Roast-Chicken-Gyros-1200-4547.jpg', N'Roasting', 20)
SET IDENTITY_INSERT [dbo].[Recipes] OFF
GO
ALTER TABLE [dbo].[IngredientsInRecipe]  WITH CHECK ADD FOREIGN KEY([ingredientId])
REFERENCES [dbo].[Ingredients] ([id])
GO
ALTER TABLE [dbo].[IngredientsInRecipe]  WITH CHECK ADD FOREIGN KEY([recipeId])
REFERENCES [dbo].[Recipes] ([id])
GO
USE [master]
GO
ALTER DATABASE [cgroup98_dish] SET  READ_WRITE 
GO
