from django.urls import path
from .views import (
    CreateUserView,
    RecordPaymentView,
    AgentSendTotalView,
    AlertsListView,
    PaymentsHistoryView,
    GetAgentPaymentsView
)

urlpatterns = [
    path('users/create/', CreateUserView.as_view()),
    path('payments/', RecordPaymentView.as_view()),
    path('payments/history/', PaymentsHistoryView.as_view(), name='payment_history'),
    path('agents/<str:agent_id>/send_total/', AgentSendTotalView.as_view()),
    path('alerts/', AlertsListView.as_view()),
    # path('api/agents/<str:agent_id>/transactions/', GetAgentPaymentsView.as_view()),

]
