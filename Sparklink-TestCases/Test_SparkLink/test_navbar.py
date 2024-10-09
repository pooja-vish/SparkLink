from seleniumbase import BaseCase

class NavbarTestCase(BaseCase):
    def test_navbar(self):
        #open the sparklink home page
        self.open("http://localhost:3000/")

        if self.is_element_visible(".navBackground.mt-3.collapse.show"):
            print("Element is Visible")
            self.click(".navBackground.mt-3.collapse.show")
            self.sleep(2)

            for i in range (1,4):
                nav_id=f'li[{i}]'
                selector = f'// *[ @ id = "root"] / div[1] / div / div / nav / div / ul[1] / {nav_id}'
                self.sleep(2)

                if self.is_element_visible(selector):
                    self.hover(selector)
                    get_text=self.get_text(selector)
                    self.sleep(3)
                    print(f"After checking index {nav_id} i saw the text {get_text} ")

                else:
                    print(f"nav id {nav_id} not found ")

            for i in range (1,4):
                nav_id=f'li[{i}]'
                selector = f'// *[ @ id = "root"] / div[1] / div / div / nav / div / ul[2] / {nav_id}'
                self.sleep(2)

                if self.is_element_visible(selector):
                    self.hover(selector)
                    get_text=self.get_text(selector)
                    self.sleep(3)
                    print(f"After checking index {nav_id} i saw the text {get_text} ")

                else:
                    print(f"nav id {nav_id} not found ")

        #This click the user profile section, should be done in aother page.
        self.click_xpath('// *[ @ id = "root"] / div[1] / div / div / nav / div / ul[1] / li[1]')
        self.sleep(3)

