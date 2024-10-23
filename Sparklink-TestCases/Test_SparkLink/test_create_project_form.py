from seleniumbase import BaseCase
import random
class CreateProjectFormTest(BaseCase):
    def test_create_form(self):
        self.open("http://localhost:3000/") #open up the web application
        self.sleep(3) # sleeps for 3 seconds

        self.click(".navBackground.mt-3.collapse.show")#open up the navigation bar
        self.sleep(3)
        if self.is_element_visible('//*[@id="root"]/div[1]/div/div/nav/div/ul[2]/li[1]'): #checks if the element we want to click is present
            print("element is visible") # gives the confirmation message
            self.click_xpath('//*[@id="root"]/div[1]/div/div/nav/div/ul[2]/li[1]') #clicks the button then it navigates to the form page
            self.sleep(3)

            self.send_keys('[name="project_name"]', "Web Design")
            self.sleep(2)

            E_Commerce='[value="E-Commerce"]'
            SocialMedia='[value="Social Media"]'
            internal_tool='[value="internal tool"]'
            #Other="#root > div > div.row > div.col-11 > div > div.createproject_layout > div > form > div:nth-child(4) > input[type=checkbox]:nth-child(7)"
            Website ='[value="Website"]'
            AndroidApp ='[value="Android App"]'
            IOSApp ='[value="IOS App"]'
            WindowsSoftware ='[value="Windows Software"]'
            Other ="#root > div > div.row > div.col-11 > div > div.createproject_layout > div > form > div:nth-child(6) > input[type=checkbox]:nth-child(9)"

            first_selection=[E_Commerce,SocialMedia,internal_tool]
            second_selection=[Website,AndroidApp,IOSApp,WindowsSoftware ]
            first_choice=random.sample(first_selection,2)
            self.sleep(3)
            for choice in first_choice:
                self.click(choice)  # Click each randomly selected checkbox
                self.sleep(1)  # Optional: pause between clicks if needed

            #self.click(Other)#this is for the option button when it if functional

            second_choice=random.sample(second_selection,2)
            self.sleep(3)
            for choice in second_choice:
                self.click(choice)
                self.sleep(1)

            self.send_keys('[name="project_budget"]', "$50,000")
            self.sleep(2)

            self.send_keys('[name="project_audience"]', "The Students, The Teachers")
            self.sleep(2)

            # raise this the selector is same as the project timeline selector
            self.send_keys("#root > div > div.row > div.col-11 > div > div.createproject_layout > div > form > input[type=text]:nth-child(12)", "For the e-commerce site, I want to include user-friendly navigation, secure payment gateways, a product catalog with search and filter options, customer reviews and ratings, personalized recommendations, a shopping cart, order tracking, inventory management, and a responsive design for both desktop and mobile users.")
            self.sleep(2)

            self.click(".submit.button-home")
            self.sleep(2)

        else:
            print("element is not visible")
