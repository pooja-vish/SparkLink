from seleniumbase import BaseCase
from selenium.common.exceptions import ElementClickInterceptedException, ElementNotInteractableException

class TestCheckProject(BaseCase):
    def test_check_project(self):
        # Open the application
        self.open("http://localhost:3100/")
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
        while True:
            nav_id = f'div[{i}]'
            selector = f'//*[@id="root"]/div/div[1]/div/div[2]/div/div[2]/div/div[2]/div/{nav_id}'
            # Check if the project element is visible
            if self.is_element_visible(selector):
                projectname= self.get_text(selector)
                print(f"Element {i} is visible with the project name {projectname}")

                #     self.scroll_to(selector)  # Scroll to the element to ensure visibility
                #     self.click_xpath(selector)  # Attempt to click the element
                #     self.sleep(2)
                #     i += 1  # Move to the next project

                try:
                    #self.scroll_to(selector)  # Scroll to the element to ensure visibility
                    self.click_xpath(selector)  # Attempt to click the element
                    self.sleep(2)
                    i += 1  # Move to the next project

                except ElementClickInterceptedException:
                    print("Element click intercepted, stopping execution.")
                    break  # Exit the loop if element is not clickable

            else:
                print("No more elements to click.")
                break  # Break the loop if no more elements are visible

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
                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                        nativeInputValueSetter.call(inputField, "windsor" );
                        inputField.dispatchEvent(new Event('input', { bubbles: true }));
                        inputField.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                """)
                self.sleep(3)
                print("Set value using JavaScript as fallback")

        else:
            print("Element is not visible")