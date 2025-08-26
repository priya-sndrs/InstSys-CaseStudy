# Function 1: Returns some value and calls the builder function
def function_1():
    return "Hello"  # Return value to be passed into builder

# Function 2: Returns some value and calls the builder function
def function_2():
    return "World"  # Return value to be passed into builder

# Builder function that combines both values
def builder(func1_result, func2_result):
    return f"{func1_result} {func2_result}"

# Directly pass results of function_1 and function_2 into the builder function
combined_result = builder(function_1(), function_2())  # Call both functions directly inside the builder

# Output the combined result
print(combined_result)  # Output: "Hello World"
