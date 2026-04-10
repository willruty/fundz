package application

import (
	"fundz/internal/model/dto"
	"fundz/internal/service"
)

type DashboardService struct {
	Account     service.AccountService
	Goal        service.GoalService
	Transaction service.TransactionService
	Category    service.CategoryService
}

func (d DashboardService) GetDashboardOverview(userID string) (dto.DashboardDTO, error) {

	var dashboard dto.DashboardDTO
	var err error

	dashboard.Accounts, err = d.Account.GetAccountsSummary(userID)
	if err != nil {
		return dto.DashboardDTO{}, err
	}

	dashboard.Goal, err = d.Goal.FilterNextGoal(userID)
	if err != nil {
		return dto.DashboardDTO{}, err
	}

	dashboard.LastMonthTransactions, err = d.Transaction.GetLastMonthTransactions(userID)
	if err != nil {
		return dto.DashboardDTO{}, err
	}

	dashboard.Categories, err = d.Category.GetCategorySummary(userID)
	if err != nil {
		return dto.DashboardDTO{}, err
	}

	return dashboard, nil
}
