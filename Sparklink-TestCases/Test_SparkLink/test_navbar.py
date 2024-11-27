from seleniumbase import BaseCase

class NavbarTestCase(BaseCase):
    def test_navbar(self):
        #open the sparklink home page
        self.open("http://localhost:3100/")

        if self.is_element_visible(".navbar.content.navBackground"):
            print("Element is Visible")
            self.click(".navbar.content.navBackground")
            self.sleep(2)

            for i in range (1,4):
                nav_id=f'li[{i}]'
                selector = f'//*[@id="root"]/div/div[1]/div[1]/div/div/nav/div/ul[1]/{nav_id}'
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
                selector = f'//*[@id="root"]/div/div[1]/div[1]/div/div/nav/div/ul[2]/{nav_id}'
                self.sleep(2)

                if self.is_element_visible(selector):
                    self.hover(selector)
                    get_text=self.get_text(selector)
                    self.sleep(3)
                    print(f"After checking index {nav_id} i saw the text {get_text} ")

                else:
                    print(f"nav id {nav_id} not found ")
        else:
            print("Element is not Visible")
