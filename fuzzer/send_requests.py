import requests
import random
import sys
from mutations import generateInputs

TEST_SERVER_BASE_URL = "http://localhost:5000"

def compute_crashes(file_name):
    status_codes = {'1': 0, '2': 0, '3': 0, '4': 0, '5': 0}
    with open(file_name) as fp:
        lines = fp.readlines()
        for status_code in lines:
            status_codes[status_code[0]] += 1

    print(status_codes)
    crash_ratio = status_codes['5']/sum(status_codes.values())
    print(f'crash ratio for {file_name}: {crash_ratio}')
    return crash_ratio

def main():
    generateInputs()
    with open('files/inputs.txt') as input_fp:
        with open('files/qc-entry.txt', "w") as output_fp:
            lines = input_fp.readlines()
            for line in lines:
                random_machine_type_id = random.randint(0, sys.maxsize)
                payload = {"workorder_number": line, "machine_type_id": random_machine_type_id}
                response = requests.post(f"{TEST_SERVER_BASE_URL}/workorders", data=payload)
                output_fp.write(f'{str(response.status_code)}\n')
    
    generateInputs()
    with open('files/inputs.txt') as input_fp:    
        with open('files/machine-types.txt', "w") as output_fp:
            lines = input_fp.readlines()
            for line in lines:
                payload = {"type_name": line}
                response = requests.post(f"{TEST_SERVER_BASE_URL}/machine_types", data=payload)
                output_fp.write(f'{str(response.status_code)}\n')
    
    generateInputs()
    with open('files/inputs.txt') as input_fp:    
        with open('files/component-types.txt', "w") as output_fp:
            lines = input_fp.readlines()
            for line in lines:
                payload = {"type_name": line}
                response = requests.post(f"{TEST_SERVER_BASE_URL}/component_types", data=payload)
                output_fp.write(f'{str(response.status_code)}\n')
    
    generateInputs()
    with open('files/inputs.txt') as input_fp:    
        with open('files/failing-reasons-types.txt', "w") as output_fp:
            lines = input_fp.readlines()
            for line in lines:
                payload = {"reason": line}
                response = requests.post(f"{TEST_SERVER_BASE_URL}/failing_reasons_types", data=payload)
                output_fp.write(f'{str(response.status_code)}\n')

if __name__ == '__main__':
    main()
    qc_entry_crash = compute_crashes('files/qc-entry.txt')
    machine_types_crash = compute_crashes('files/machine-types.txt')
    component_types_crash = compute_crashes('files/component-types.txt')
    failing_reasons_types_crash = compute_crashes('files/failing-reasons-types.txt')

    # write to final output
    with open("output.txt", "w") as fp:
        fp.write(f"qc-entry: {qc_entry_crash}\n")
        fp.write(f"machine-types: {machine_types_crash}\n")
        fp.write(f"component-types: {component_types_crash}\n")
        fp.write(f"failing-reasons-types: {failing_reasons_types_crash}\n")