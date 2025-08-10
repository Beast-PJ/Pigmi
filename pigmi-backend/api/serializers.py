from rest_framework import serializers

class RecordPaymentSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    customer_id = serializers.CharField()
    agent_id = serializers.CharField()
    amount = serializers.FloatField()
    note = serializers.CharField(required=False, allow_blank=True)

class SendTotalSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    total = serializers.FloatField()
