from faker import Faker
import random
fake = Faker()
edadAleatoria = random.randint(13, 21)
print("Nombre > " + fake.name_male())
print("Direccion > " + fake.address())
print("Direccion Email > " + fake.email(domain="gmail.com"))
print("Ip > " + fake.ipv4())
print("Edad > " + str(edadAleatoria))