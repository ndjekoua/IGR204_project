﻿﻿# IGR204 - Design and development of a visualization toolHow do Europeans spend their time ?@Author:Kim Seung-Hye Lu KevinSteiner VladimirNdjekoua Sandjo Jean Thibaut# introductionSince the advent of computer graphics, information visualization has benefited from new possibilities of data representation. Software development kits offer many tools to the developer, allowing users to make a dynamic interface from evolving data. One of the most obvious points of interest is adding interactivity, so that the end-user can filter data according to different points of interest or specific criterias. The goal of this project is to develop  a fully-functional interactive information visualization using D3 which is a tool that is commonly used to create web-based, interactive data visualisation.# The DatasetTime use surveys (TUS) measure the amount of time people spend doing various activities, such as paid work, household, family care, personal care, voluntary work, social life, travel, and leisure activities. The survey consists of a household interview, a personal interview, a diary and a week diary. The resulting Dataset that will be used for this project consists in 2835 rows described by 8 attributes.Time use surveys are used to support equality, family, social, transport and cultural policies and to measure the value of household production and for international comparisons. Data are acquired by interviewing the sampled individuals directly and letting them fill in the diary.This Eurobase domain presents results from waves 1 and 2 of the Harmonised European Time Use Surveys (HETUS). Wave 1, i.e. HETUS 2000, had been carried out by 15 European countries between 1998 and 2006. The results were harmonised by Statistics Finland and Statistics Sweden with the financial support of Eurostat. Wave 2, i.e. HETUS 2010, had been carried out by 18 European countries between 2008 and 2015. The results were harmonised by Statistics Finland with the financial support of Eurostat.# Potential Users and Their Background When we took this dataset, we estimated that it could serve at research purposes, especially in sociology and economy as people working in these fields are the most likely to consider large-scale phenomenons of people’s daily behaviour such as How they Spend Their Time in order to give to people the possibility to  compare with other people of their group age in order to see if what they are doing is normal for their age group, gender, or other similar grouping.This implies a certain knowledge of geographical European data but also the traditions,the culture and economic system of each country, even if not directly exploitable from our current dataset.# What are The Users Trying to Understand From Data?These researchers usually try to outline correlations between one or several factors and a particular phenomenon. With this in mind, Time Use in a specific country can be related to an estimated level of happiness or issues like alcoholism,the most attractive activities by country or by year,the repartition of activities among male and female.In order to achieve our goal, we will make an exploration of the available dataset in order to highlight important phenomenons and communicate the findings to the user using graphs and charts for an easier and better understanding.                                          # Representative tasksWithin our visualization tool, the user should be able to sum up cultural practices of a given country quickly, according to a specific activity. For example, if a researcher wants to know if some European countries particularly value the old-fashioned practice of handicraft, he should be able to notice it with the least effort and time.As participation time is intrinsically linked to the participation rate of a given activity, we considered that when the end-user focuses on participation time on a specific activity for each country, the participation rate among polled citizens should be mentioned clearly by another mean. In this way, the user will be able to have an idea of the level of dedication of each participant on the current activity (participation time), as well as the large-scale popularity or accessibility of this activity in the country (participation rate).The last key point of our visualization is comparing relative amounts of time spent on two or more types of activities among all respondent countries. For example, some researchers may want to consider if more time is spent on personal care than on household care in Spain. It would also be useful to know if the relative values of time spent on both activities remain equivalent around Europe or rather the opposite : we might have different statements to make according to the country. The main goal is to order the activities according to their level of importance in citizens’ state of mind.As we also mentioned, pie charts are good at bringing to light relative values between different activities, but we have no idea of the amount of time that the whole set of selected activities represent for a given country. With this in mind, it was also important for us to provide a way so that the user is able to compare exact values of total time spent on the selected activities, between all the countries of the dataset.# Final designFor our final design, we could mix the previous sketches. In a geographical map, instead of having two select options (genders and activities), we could replace the gender option by a period option and put the gender information as a tooltip. This trade off will allow to better convey the same informations. Also, we could display the bar chart of the activities for each country just next to the map so the users can both have a visualization of areas but also the value for each country. We could then link the 2 graphs so that, whenever we pass the mouse over a country, we could highlight the corresponding country in the bar chart so the user will be able to instantly find the value. Or on the contrary, hover the mouse over a bar and the country will be highlighted. For time spent, we draw a pie chart on each country, which shows the relative amount of time spent on each selected activity. We first thought that we could show the total amount of time represented by selected activities by adjusting the radius of the pie chart, but as mentioned before we have the problem of overlapping pie charts. Instead, we preferred adjusting the size of the pie charts statically according to the superficy of each country, while showing the total amount of time on a histogram on the left panel.However, we still need to study about the feasibility of this kind of visualization and interaction with the different technologies we learned during the course. # Lunch The ApplicationIn order to run the application, you  need to:*  Download the folder *IGR204_Project*. and save it on your local machine* Open the folder IGR204_project and from tha folder, open a terminal* From the terminal, lunch the following command:   ``python -m http.server 8080``(This command will start a server on your localhost on port: 8080.So make sure you have python3 installed and port 8080 is not used by another application  before executing the command)* From a browser, type the following URL in the navigation bar:   **localhost:8080**# Great your done,Enjoy Your Exploration!!