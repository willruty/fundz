package service

import (
	"fundz/internal/database"
	"fundz/internal/model/dto"
	model "fundz/internal/model/entity"
	"time"
)

type TransactionService struct{}

func (t TransactionService) GetLastMonthTransactions(userId string) ([]dto.TransactionSummaryDTO, error) {

	var transactions []model.Transactions

	thirtyDaysAgo := time.Now().AddDate(0, 0, -30)

	err := database.DB.
		Where("user_id = ? AND occurred_at >= ?", userId, thirtyDaysAgo).
		Order("occurred_at ASC").
		Find(&transactions).Error

	if err != nil {
		return nil, err
	}

	var summary []dto.TransactionSummaryDTO

	for _, tx := range transactions {
		summary = append(summary, dto.TransactionSummaryDTO{
			Date:  tx.OccurredAt,
			Value: tx.Amount,
			Type:  tx.Type,
		})
	}

	return summary, nil
}
