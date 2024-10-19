import requests
# DNA1QRTAMM48HXHK0T8TM6BV4451
def call_climatiq_api_for_steel(name, weight, weight_unit):
    return call_climatiq_api(name, weight, weight_unit, "metals-type_steel_production")

def call_climatiq_api_for_iron(name, cost, currency):
    return call_climatiq_api_iron(name, cost, currency, "mined_materials-type_iron_ores")

def call_climatiq_api(name, weight, weight_unit, activity_id):
    print("climatiq api for steel")
    url = "https://api.climatiq.io/estimate"
    headers = {
        "Authorization": f"Bearer Apikey",
        "Content-Type": "application/json"
    }

    data = {
        "emission_factor": {
            "activity_id": activity_id,
            "source": "Climate TRACE",
            "region": "IN",
            "source_lca_activity": "cradle_to_gate",
            "data_version": "^0"
        },
        "parameters": {
            "weight": weight,
            "weight_unit": weight_unit
        }
    }
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"API request failed with status code {response.status_code}")
        return None

def call_climatiq_api_iron(name, cost, currency, activity_id):
    print("climatiq api for iron")
    url = "https://api.climatiq.io/estimate"
    headers = {
        "Authorization": f"Bearer Apikey",
        "Content-Type": "application/json"
    }

    data = {
        "emission_factor": {
            "activity_id": activity_id,
            "source": "EXIOBASE",
            "region": "IN",
            "source_lca_activity": "unknown",
            "data_version": "^0"
        },
        "parameters": {
            "money": cost,
            "money_unit": currency
        }
    }

    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"API request failed with status code {response.status_code}")
        return None