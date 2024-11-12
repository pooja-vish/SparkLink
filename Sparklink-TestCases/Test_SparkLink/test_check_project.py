from seleniumbase import BaseCase
from selenium.common.exceptions import ElementClickInterceptedException, ElementNotInteractableException
from selenium.webdriver.common.keys import Keys
class TestCheckProject(BaseCase):
    def test_check_project(self):
        # Open the application
        self.open("http://localhost:3100/")
        self.driver.maximize_window()
        self.sleep(3)  # Sleep for 3 seconds

        # Open up the navigation bar
        self.click(".navBackground.collapse.show")
        self.sleep(3)

        # Check if the specific element is visible
        if self.is_element_visible('//*[@id="root"]/div/div[1]/div[1]/div/div/nav/div/ul[2]/li[2]'):
            print("Element is visible")
        else:
            print("Element is not visible")

        # Click on the element if visible
        self.click_xpath('//*[@id="root"]/div/div[1]/div[1]/div/div/nav/div/ul[2]/li[2]')
        self.sleep(3)

        #Initialize project index
        i = 1
        max_attempts = 1  # Limit the number of scroll attempts to avoid infinite loops
        scroll_attempts = 0

        while True:
            nav_id = f'div[{i}]'
            selector = f'//*[@id="root"]/div/div[1]/div/div[2]/div/div[2]/div/div[2]/div/{nav_id}'
            # Check if the project element is visible
            if self.is_element_visible(selector):
                #gettinig the project text self.get_text not working so we used javascript to retrieve the text
                project_name = self.execute_script("return arguments[0].textContent;", self.find_element(selector))
                print(f"Element {i} is visible with the project name: '{project_name.strip()}'")

                try:
                    self.scroll_to(selector)  # Scroll to the element to ensure visibility
                    self.click_xpath(selector)  # Attempt to click the element
                    self.sleep(1)
                    i += 1  # Move to the next project


                except ElementClickInterceptedException:
                    print("Element click intercepted, stopping execution.")
                    break  # Exit the loop if element is not clickable

            else:
                if scroll_attempts < max_attempts:
                    # Attempt to scroll further to load more elements, if available
                    self.execute_script("window.scrollBy(0, 500);")
                    self.sleep(2)  # Wait for new elements to load
                    scroll_attempts += 1
                else:
                    print("No more elements to click or scroll attempts exceeded.")
                    break
        self.click("body > div.fade.modal.show > div > div > div.modal-header > button")
        self.sleep(2)
        self.scroll_to_top()
        self.sleep(5)
        if self.is_element_visible("#root > div > div.content-container > div > div.progress_container > div > div.col-lg-11.col-md-11.col-sm-9 > div > div.search-container > div > div"):
            print("Search field is visible")
            try:
                # Scroll to the element to make sure it is in view
                self.scroll_to("#root > div > div.content-container > div > div.progress_container > div > div.col-lg-11.col-md-11.col-sm-9 > div > div.search-container > div > div")
                # Attempt to click the element
                self.click("#root > div > div.content-container > div > div.progress_container > div > div.col-lg-11.col-md-11.col-sm-9 > div > div.search-container > div > div")
                self.sleep(4)
                self.send_keys("#root > div > div.content-container > div > div.progress_container > div > div.col-lg-11.col-md-11.col-sm-9 > div > div.search-container > div > div","windsor/n")
                self.sleep(3)

            except ElementNotInteractableException:
                self.execute_script("""
                                    let inputField = document.querySelector("#root > div > div.content-container > div > div.progress_container > div > div.col-lg-11.col-md-11.col-sm-9 > div > div.search-container > div > div input");
                                    if (inputField) {
                                        inputField.focus();
                                    }
                                """)
                # Now use Selenium's send_keys
                input_selector='#root > div > div.content-container > div > div.progress_container > div > div.col-lg-11.col-md-11.col-sm-9 > div > div.search-container > div > div input'
                self.send_keys(input_selector,"windsor")
                self.sleep(1)
                self.send_keys(input_selector, Keys.ENTER)
                self.sleep(5)
                print("Set value using JavaScript as fallback")

        else:
            print("Element is not visible")