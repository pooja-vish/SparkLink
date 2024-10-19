from seleniumbase import BaseCase

class Test_homepage(BaseCase):
    def test_homepage(self):
        #Opens the Sperklink homepage.
        self.open("http://localhost:3000/")
        self.sleep(2)#Sleeps for two seconds

        #Scrolls to the bottom of the page
        self.scroll_to_bottom()
        self.sleep(4)

        #scrolls back to the top
        self.scroll_to('[alt="Logo"]',by="css selector")
        self.sleep(2)
# wddcdc
        #click on all the navigations bars and return to the home page
        # for i in range (1,4): #iterate through all the nav bars and click them.
        #     index_num=f'/div[1]/div[1]/div/div[2]/span[{i}]/a'
        #     selector =f'//*[@id="root"]{index_num}'
        #
        #     if self.is_element_visible(selector): #If the nav bar is visible
        #         nav_text = self.get_text(selector)#gets the nav bar text
        #
        #         if index_num == "/div[1]/div[1]/div/div[2]/span[2]/a" : #If the program iterates to the first index
        #             self.click(selector)
        #             self.sleep(2)
        #             print(f'{nav_text} was clicked successfully')
        #             self.click("#root > div > div > div.col-lg-3.col-md-6.col-sm-12.mt-2.nav-text.d-flex > span:nth-child(1) > a")
        #             self.sleep(2)
        #
        #         if index_num == "/div[1]/div[1]/div/div[2]/span[3]/a" :
        #             self.click(selector)
        #             self.sleep(2)
        #             print(f'{nav_text} was clicked successfully')
        #             self.click("#root > div > div > div.col-lg-3.col-md-6.col-sm-12.mt-2.nav-text.d-flex > span:nth-child(1) > a")
        #             self.sleep(5)
        #
        #         print(f"after checking the index,{index_num} we saw the text: {nav_text}")
        #     else:
        #         print(f"The nav bar with the id {index_num} is not visible")


        #Click know more button about the project
        self.scroll_to("#root > div.home_container > div.container-fluid.background > div.row > div.text-center.mb-4.mt-4 > button")
        # root > div.home_container > div.container-fluid.background > div.row > div.text-center.mb-4.mt-4 > button
        self.sleep(2)
        self.click("#root > div.home_container > div.container-fluid.background > div.row > div.text-center.mb-4.mt-4 > button")
        self.sleep(2)

        #click the know more button for the business owners
        self.scroll_to("#root > div.home_container > div:nth-child(2) > div:nth-child(2) > div.col-lg-8.col-md-8.col-sm-12.py-3 > div > div.mt-4.mb-5.text-center > button")
        self.sleep(2)
        self.click("#root > div.home_container > div:nth-child(2) > div:nth-child(2) > div.col-lg-8.col-md-8.col-sm-12.py-3 > div > div.mt-4.mb-5.text-center > button")
        self.sleep(2)

        #click the know more button for the students
        self.scroll_to("#root > div.home_container > div:nth-child(2) > div:nth-child(3) > div.col-lg-8.col-md-8.col-sm-12.py-3 > div > div.mt-4.mb-5.text-center > button")
        self.sleep(2)
        self.click("#root > div.home_container > div:nth-child(2) > div:nth-child(3) > div.col-lg-8.col-md-8.col-sm-12.py-3 > div > div.mt-4.mb-5.text-center > button")
        self.sleep(2)

        #click the know more button for the task
        self.scroll_to("#root > div.home_container > div:nth-child(2) > div:nth-child(4) > div.col-lg-8.col-md-8.col-sm-12.py-3 > div > div.mt-4.mb-5.text-center > button")
        self.sleep(2)
        self.click("#root > div.home_container > div:nth-child(2) > div:nth-child(4) > div.col-lg-8.col-md-8.col-sm-12.py-3 > div > div.mt-4.mb-5.text-center > button")
        self.sleep(2)