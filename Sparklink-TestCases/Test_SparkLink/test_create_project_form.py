from seleniumbase import BaseCase
import random
class CreateProjectFormTest(BaseCase):
    def test_create_form(self):
        self.open("http://localhost:3100/") #open up the web application
        self.sleep(3) # sleeps for 3 seconds


        self.click(".navBackground.collapse.show")#open up the navigation bar
        self.sleep(3)
        if self.is_element_visible('//*[@id="root"]/div/div[1]/div[1]/div/div/nav/div/ul[2]/li[1]'): #checks if the element we want to click is present
            print("element is visible") # gives the confirmation message
            self.click_xpath('//*[@id="root"]/div/div[1]/div[1]/div/div/nav/div/ul[2]/li[1]') #clicks the button then it navigates to the form page
            self.sleep(3)

            self.send_keys('[name="project_name"]', "Web Design")
            self.sleep(2)

            E_Commerce='[value="E-Commerce"]'
            SocialMedia='[value="Social Media"]'
            internal_tool='[value="Internal Tool"]'
            #Other="#root > div > div.row > div.col-11 > div > div.createproject_layout > div > form > div:nth-child(4) > div:nth-child(4) > input[type=checkbox]"
            Website ='[value="Website"]'
            AndroidApp ='[value="Android App"]'
            IOSApp ='[value="IOS App"]'
            WindowsSoftware ='[value="Windows Software"]'
            #Other2 ="#root > div > div.row > div.col-11 > div > div.createproject_layout > div > form > div:nth-child(6) > div:nth-child(5) > input[type=checkbox]"

            first_selection=[E_Commerce,SocialMedia,internal_tool]
            second_selection=[Website,AndroidApp,IOSApp,WindowsSoftware]
            first_choice=random.sample(first_selection,2)
            self.sleep(3)
            for choice in first_choice:
                self.click(choice)  # Click each randomly selected checkbox
                self.sleep(1)  # Optional: pause between clicks if needed

                # if choice == Other:
                #     self.send_keys("#root > div > div.row > div.col-11 > div > div.createproject_layout > div > form > div:nth-child(4) > input[type=text]", "Testing if the other section works")

            #self.click(Other)#this is for the option button when it if functional

            second_choice=random.sample(second_selection,2)
            self.sleep(3)
            for choice in second_choice:
                self.click(choice)
                self.sleep(1)

                # if choice == Other2:
                #     self.send_keys("#root > div > div.row > div.col-11 > div > div.createproject_layout > div > form > div:nth-child(6) > input[type=text]", "Testing if the other section works")


            self.send_keys('[name="project_budget"]', "$50,000")
            self.sleep(2)

            self.send_keys('[name="project_audience"]', "The Students, The Teachers")
            self.sleep(2)

            # raise this the selector is same as the project timeline selector
            self.send_keys('[name="features"]', "Jut WOW me please")
            self.sleep(2)

            self.send_keys('[name="project_deadline"]', "002026-10-10")
            self.sleep(3)

            # This field is to upload file

            file_path = "/Users/fajukoodunayo/Downloads/AfricaMap.jpg"
            self.choose_file('[accept="image/*"]', file_path, by="css selector")
            self.sleep(4)

            self.click(".submit.button-home")
            self.sleep(10)

        else:
            print("element is not visible")

