# 

In the module of Web Technology, we need to create a CRUD functionality project with Javascript, Node.js and Express.js. There are given couple of options to do, and we can find it by ourselves 

I've decided to choose Book Review App, because it seems moe interesting and when I read something comes to my brain what I need to do for this project. The overall purpose of the project is sharing the reviews and opinions about the book with others. It is open source web application, everyone can enter and leave their opinions about the existed books, if there is no available  the book which they wanted they can add, and leave their reviews on each book. Additionally, there are some cases that people cannot choose the book to read because they don't know what kind of book is that. At that time as well they can enter and search their favourite book, read reviews and decide to read it or not. 

The user may have some questions how to run the project locally. I'll provide the full guidelines step by step. 
1. After installing the project to IDE, open the terminal and type "npm install" it wil install all necessary folders, files and dependencies which are necessary to my project. 
2. The 2nd command will be "nodemon app.js", when you type this command in terminal, it will gives you link on which server it is running. You need to copy the link, and paste to the browser. Finally, you have an access to see my project in your browser.

Here is the dependencies list which I've installed, but I know that not all of them are necessary, but I don't want to remove them. 
1. bcryptjs
2. body-parser
3. cookie-parser
4. dotenv
5. express
6. jsonwebtoken
7. pug

but I've used only:
1. express
2. body-parser
3. pug

LINKS:

Here is the link for public repo in GitHub: https://github.com/mzokirova/WT_CW_00018919.git 

Here is the link for hosted website: https://automatic-lumpy-serpent.glitch.me 

TIPS:
1. There maybe some waiting times when you are deleting and adding, because it will update the database, just wait 1-2 seconds
2. When you want to delete the review, just after adding new review, it may not delete because it hasn't saved yet. For that just refresh reviews page, and then delete. 
3. It has email validation and couple of content validation by requiring to fill the inputs in a correct format. 
