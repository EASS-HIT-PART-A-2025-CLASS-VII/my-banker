import pytest
from app import app  
import json

@pytest.fixture
def client():
    app.testing = True
    with app.test_client() as client:
        yield client

def test_post_manual_report(client):
    sample_payload = {
        "result": [
            {
                "hash": "0xabc123",
                "block_timestamp": "2021-05-07T11:08:35.000Z",
                "from_address": "0xfrom",
                "erc20_transfer": [
                    {
                        "token_symbol": "USDT",
                        "value": "1000000",
                        "token_decimals": "6",
                        "transaction_hash": "0xtx1",
                        "block_timestamp": "2021-05-07T11:08:35.000Z",
                        "from_address": "0xfrom",
                        "to_address": "0xto"
                    }
                ]
            }
        ]
    }

    response = client.post('/manual-reports', json=sample_payload)
    assert response.status_code == 200

    data = response.get_json()
    assert "report" in data
    assert "balances" in data["report"]
    assert "transactions" in data["report"]
