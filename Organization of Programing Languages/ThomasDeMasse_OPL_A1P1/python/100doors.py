# function takes in a boolean variable representing the current door state
def open_or_closed(door_state):
    # returns "Open" if door_state is True
    if door_state == True:
        return ("Open")
    # otherwise returns "Closed"
    else:
        return ("Closed")


# the "main" function
# create an array of 100 non-open doors
door_array = [None] * 100

# store length of door_array
door_array_length = len(door_array)

# set every index in door_array to False
for current_door in range(door_array_length):
    door_array[current_door] = False

# parse through array of doors 100 times
for one_hundred_passes in range(door_array_length):
    # increment indexer one_hundred_passes by +1 per each visit pass through
    for one_pass in range(one_hundred_passes, len(door_array), one_hundred_passes+1):
        # "toggle" the door
        door_array[one_pass] = not door_array[one_pass]

# print output to terminal
# parse through array of doors door_array_length times
for each_door in range(door_array_length):
    # format: "Door (number): (status)"
    # calls function open_or_closed to return door state (in order to keep format in a single line)
    print("Door " + str(each_door+1) + ": " + open_or_closed(door_array[each_door]))
