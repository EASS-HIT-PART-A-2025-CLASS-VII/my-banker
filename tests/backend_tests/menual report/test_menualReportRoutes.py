import pytest
from app import app  # assuming your Express app is exposed in app.js
import json

@pytest.fixture
def client():
    app.testing = True
    return app.test_client()

def test_manual_report_route(client):
    payload = {
        "result": [{
            "value": "1000000000000000000",
            "erc20_transfer": [{
                "token_symbol": "USDT",
                "value": "1000000"
            }],
            "nft_transfers": [{
                "contract_type": "ERC721",
                "amount": "2"
            }],
            "native_transfers": [{
                "value": "500000000000000000",
                "token_symbol": "ETH"
            }],
            "internal_transactions": []
        }]
    }
    response = client.post("/manual-report", data=json.dumps(payload), content_type='application/json')
    assert response.status_code == 200
    data = response.get_json()
    assert "profit_and_loss_report" in data
    assert "current_balances" in data
    assert "actions_report" in data
    assert "transactions" in data
