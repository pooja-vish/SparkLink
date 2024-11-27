from seleniumbase import BaseCase
import random

from seleniumbase.fixtures.page_actions import click


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

        self.send_keys("#pass", "Testing123")
        self.sleep(3)

        self.send_keys("#re_pass", "Testing123")
        self.sleep(3)

        # supervisor="#projectOwner"
        # projectowner="#businessOwner"
        #
        #
        # roles=[supervisor,projectowner]
        # randomselection = random.choice(roles)
        # self.click(randomselection)
        # self.sleep(3)
        # role_picked = self.get_text(randomselection)
        # print(f'The system picked the role {role_picked}')

        self.click("#roleSelect")
        Busiiness_Owner="#roleSelect > option:nth-child(2)"
        Supervisor="#roleSelect > option:nth-child(3)"
        Student="#roleSelect > option:nth-child(4)"

        RoleChoice=[Busiiness_Owner,Supervisor,Student]
        randomselector= random.choice(RoleChoice)
        self.click(randomselector)
        self.sleep(2)

        self.click("#signup")
        self.sleep(10)





