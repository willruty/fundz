package service

import (
	"fundz/internal/database"
	model "fundz/internal/model/entity"
	"time"
)

func GetLastMonthTransactions(userId string) ([]model.Transactions, error) {
	var transactions []model.Transactions
	var count int64

	thirtyDaysAgo := time.Now().AddDate(0, 0, -30)

	err := database.DB.Model(&model.Transactions{}).
		Where("user_id = ? AND occurred_at >= ?", userId, thirtyDaysAgo).
		Order("occurred_at ASC").
		Find(&transactions).
		Count(&count).Error

	if err != nil {
		return nil, err
	}

	return transactions, nil
}
