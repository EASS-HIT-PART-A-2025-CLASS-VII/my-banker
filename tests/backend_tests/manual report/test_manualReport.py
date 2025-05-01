import pytest
from manualReports import getProfitAndLoss, getWalletBalances, getActionsReport

# Sample transaction data
@pytest.fixture
def sample_transactions():
    return [{
        "value": "1000000000000000000",
        "erc20_transfer": [{
            "token_symbol": "USDT",
            "value": "1000000",
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

def test_get_profit_and_loss(sample_transactions):
    result = getProfitAndLoss(sample_transactions)
    assert "total_profit" in result
    assert "total_loss" in result

def test_get_wallet_balances(sample_transactions):
    result = getWalletBalances(sample_transactions)
    assert "native_tokens" in result
    assert "erc20_tokens" in result
    assert "nfts" in result
    assert isinstance(result["nfts"], list)

def test_get_actions_report(sample_transactions):
    result = getActionsReport(sample_transactions)
    assert "calculation_method" in result
    assert "total_actions" in result
    assert "trade_volume" in result
    assert "total_fees" in result
