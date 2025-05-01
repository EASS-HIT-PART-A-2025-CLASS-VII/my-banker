import pytest
from manualReports import generate_manual_report

sample_data = {
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
            ],
            "native_transfers": [
                {
                    "token_symbol": "ETH",
                    "value_formatted": "0.1",
                    "direction": "outgoing",
                    "from_address": "0xfrom",
                    "to_address": "0xto"
                }
            ],
            "nft_transfers": [
                {
                    "token_address": "0xNFT",
                    "amount": "1",
                    "transaction_hash": "0xntfhash",
                    "block_timestamp": "2021-06-04T16:00:15",
                    "from_address": "0xfrom",
                    "to_address": "0xto"
                }
            ]
        }
    ]
}

def test_generate_manual_report():
    report = generate_manual_report(sample_data['result'])
    
    assert "balances" in report
    assert "transactions" in report

    balances = report["balances"]
    transactions = report["transactions"]

    # ERC20
    assert balances.get("USDT") == -1.0  # because sender == from_address
    # Native
    assert balances.get("ETH") == -0.1
    # NFT
    assert balances.get("NFT-0xNFT") == -1

    # Check transaction details
    assert len(transactions) == 3
