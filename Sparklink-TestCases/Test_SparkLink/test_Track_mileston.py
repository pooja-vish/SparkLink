from seleniumbase import BaseCase

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

        self.send_keys("#root > div > div.content-container > div > div.milestone_container > div > div.col-lg-11.col-md-11.col-sm-9 > div.search-container > div > div","sparklink")