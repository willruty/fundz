package service

import (
	"fundz/internal/model/dao"
	"fundz/internal/model/dto"
)

type AccountService struct{}

func (a *AccountService) GetAccountsSummary(userID string) ([]dto.AccountSummaryDTO, error) {

	accounts, _, err := dao.GetAllAccounts(userID)
	if err != nil {
		return []dto.AccountSummaryDTO{}, err
	}

	var summary []dto.AccountSummaryDTO
	for _, account := range accounts {
		summary = append(summary, dto.AccountSummaryDTO{
			Name:  account.Name,
			Balance: account.Balance,
		})
	}

	return summary, nil
}
