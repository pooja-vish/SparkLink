from seleniumbase import BaseCase
import random
class TestRegistration(BaseCase):
    def test_registration(self):
        self.open("http://localhost:3100/register")
        self.sleep(3)

        self.send_keys("#name", "Fajuko Odunayo")
        self.sleep(3)

        self.send_keys("#username", "fajuks")
        self.sleep(3)

        self.send_keys("#email","tayo@gmail.com")
        self.sleep(3)

        self.send_keys("#password", "Testing123")
        self.sleep(3)

        self.send_keys("#confirmPassword", "Testing123")
        self.sleep(3)

        supervisor="#projectOwner"
        projectowner="#businessOwner"


        roles=[supervisor,projectowner]
        randomselection = random.choice(roles)
        self.click(randomselection)
        self.sleep(3)
        role_picked = self.get_text(randomselection)
        print(f'The system picked the role {role_picked}')




