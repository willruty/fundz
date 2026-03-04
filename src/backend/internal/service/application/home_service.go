package service

import (
	"fundz/internal/model/dto"
	"fundz/internal/service"
	"log"
)

type DashboardService struct {
	Account service.AccountService
}

func (d DashboardService) GetDashboardInfo() dto.DashboardDTO {

	accounts := d.Account.GetAccountsSummary()

	log.Println(accounts)

	return dto.DashboardDTO{}
}
