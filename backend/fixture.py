from fixtureless import Factory
from public.models import Location

factory = Factory()
count = 5
location = factory.create(Location, count)