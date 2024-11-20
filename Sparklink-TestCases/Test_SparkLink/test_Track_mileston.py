from seleniumbase import BaseCase
from selenium.common.exceptions import ElementClickInterceptedException, ElementNotInteractableException
from selenium.webdriver.common.keys import Keys


class TesetrackmilestonTest(BaseCase):
    def test_track_mileston(self):
        self.open("http://localhost:3100/")
        self.sleep(2)

        self.click(".navBackground.collapse.show")
        self.sleep(3)

        # Check if the specific element is visible
        if self.is_element_visible('//*[@id="root"]/div/div[1]/div[1]/div/div/nav/div/ul[2]/li[3]'):
            print("Element is visible")
        else:
            print("Element is not visible")

        # Click on the element if visible
        self.click_xpath('//*[@id="root"]/div/div[1]/div[1]/div/div/nav/div/ul[2]/li[3]')
        self.sleep(3)

        # input the username
        self.send_keys("#root > div > div > div > form > div:nth-child(1) > input", "michael@uwindsor.ca")
        self.sleep(3)
        # input the password
        self.send_keys("#root > div > div > div > form > div:nth-child(2) > input", "testing01")
        self.sleep(3)
        # click the login button
        self.click("#root > div > div > div > form > button")
        self.sleep(3)

        if self.is_element_visible("#root > div > div.content-container > div > div.milestone_container > div > div.col-lg-11.col-md-11.col-sm-9 > div.search-container > div > div"):
            print("Search field is visible")
            try:
                # Scroll to the element to make sure it is in view
                self.scroll_to("#root > div > div.content-container > div > div.milestone_container > div > div.col-lg-11.col-md-11.col-sm-9 > div.search-container > div > div")
                # Attempt to click the element
                self.click("#root > div > div.content-container > div > div.milestone_container > div > div.col-lg-11.col-md-11.col-sm-9 > div.search-container > div > div")
                self.sleep(4)
                self.send_keys("#root > div > div.content-container > div > div.milestone_container > div > div.col-lg-11.col-md-11.col-sm-9 > div.search-container > div > div","windsor")
                self.sleep(3)

            except ElementNotInteractableException:
                # Focus on the field using JavaScript
                self.execute_script("""
                    let inputField = document.querySelector("#root > div > div.content-container > div > div.milestone_container > div > div.col-lg-11.col-md-11.col-sm-9 > div.search-container > div > div input");
                    if (inputField) {
                        inputField.focus();
                    }
                """)
                # Now use Selenium's send_keys
                input_selector = "#root > div > div.content-container > div > div.milestone_container > div > div.col-lg-11.col-md-11.col-sm-9 > div.search-container > div > div input"
                self.send_keys(input_selector, "windsor")  # Send the text
                self.sleep(1)  # Allow a moment for the text input to process
                self.send_keys(input_selector, Keys.ENTER)  # Now press Enter separately
                self.sleep(3)
                print("Set value using JavaScript as fallback")

        else:
            print("Element is not visible")