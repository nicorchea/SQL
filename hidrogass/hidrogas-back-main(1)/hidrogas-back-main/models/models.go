package models

type Item struct {
	Name  string `json:"name" binding:"required"`
	Code  string `json:"code" binding:"required"`
	Image string `json:"image" binding:"required"`
	Date  string `json:"date"`
	By    string `json:"by" binding:"required"`
	State string `json:"state" binding:"required"`
	Site  string `json:"site" binding:"required"`
}

type State struct {
	By    string `json:"by" binding:"required"`
	State string `json:"state" binding:"required"`
	Site  string `json:"site" binding:"required"`
}
