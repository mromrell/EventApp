# -*- coding: utf-8 -*-
from south.utils import datetime_utils as datetime
from south.db import db
from south.v2 import SchemaMigration
from django.db import models


class Migration(SchemaMigration):

    def forwards(self, orm):
        # Adding model 'Social'
        db.create_table(u'public_social', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('facebook_url', self.gf('django.db.models.fields.URLField')(max_length=200, blank=True)),
            ('google_plus', self.gf('django.db.models.fields.URLField')(max_length=200, blank=True)),
            ('twitter_handle', self.gf('django.db.models.fields.CharField')(max_length=50, blank=True)),
            ('user_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
        ))
        db.send_create_signal(u'public', ['Social'])

        # Adding model 'AccountInfo'
        db.create_table(u'public_accountinfo', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('birth_date', self.gf('django.db.models.fields.DateField')(auto_now_add=True, blank=True)),
            ('phone', self.gf('django.db.models.fields.CharField')(max_length=25, null=True, blank=True)),
            ('is_cell', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('street', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('city', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('state', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('country', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('is_sponsor', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('is_organizer', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('social_info', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['public.Social'], null=True, blank=True)),
            ('user_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
        ))
        db.send_create_signal(u'public', ['AccountInfo'])

        # Adding model 'Location'
        db.create_table(u'public_location', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('eventName', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('gpsLat', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('gpsLng', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('reliableGPS', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('street', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('city', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('state', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('country', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('description', self.gf('django.db.models.fields.CharField')(max_length=5000, null=True, blank=True)),
            ('sponsored', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('forCharity', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('linkUrl', self.gf('django.db.models.fields.CharField')(max_length=200, null=True, blank=True)),
            ('participantCost', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=8, decimal_places=2, blank=True)),
            ('totalCost', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=9, decimal_places=2, blank=True)),
            ('voteCount', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('datecreated', self.gf('django.db.models.fields.DateField')(default=datetime.datetime.now)),
            ('eventStartDate', self.gf('django.db.models.fields.DateField')()),
            ('eventEndDate', self.gf('django.db.models.fields.DateField')()),
            ('starLocation', self.gf('django.db.models.fields.NullBooleanField')(default=False, null=True, blank=True)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
        ))
        db.send_create_signal(u'public', ['Location'])

        # Adding model 'Payment'
        db.create_table(u'public_payment', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('payment_amount', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=9, decimal_places=2, blank=True)),
            ('sponsor_amount', self.gf('django.db.models.fields.DecimalField')(null=True, max_digits=9, decimal_places=2, blank=True)),
            ('payment_type', self.gf('django.db.models.fields.CharField')(max_length=20)),
            ('user_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
            ('event_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['public.Location'])),
        ))
        db.send_create_signal(u'public', ['Payment'])

        # Adding model 'Vote'
        db.create_table(u'public_vote', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('is_up', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('is_down', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('user_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
            ('event_id', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['public.Location'])),
        ))
        db.send_create_signal(u'public', ['Vote'])

        # Adding model 'Comment'
        db.create_table(u'public_comment', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
            ('commentText', self.gf('django.db.models.fields.CharField')(max_length=900, null=True, blank=True)),
            ('commentDate', self.gf('django.db.models.fields.DateField')(default=datetime.datetime.now)),
            ('locationRating', self.gf('django.db.models.fields.IntegerField')(null=True, blank=True)),
            ('locationPostID', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['public.Location'])),
        ))
        db.send_create_signal(u'public', ['Comment'])

        # Adding model 'Photo'
        db.create_table(u'public_photo', (
            (u'id', self.gf('django.db.models.fields.AutoField')(primary_key=True)),
            ('photo', self.gf('django.db.models.fields.files.ImageField')(max_length=100, null=True, blank=True)),
            ('is_profile', self.gf('django.db.models.fields.NullBooleanField')(null=True, blank=True)),
            ('user', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['auth.User'])),
            ('eventPostID', self.gf('django.db.models.fields.related.ForeignKey')(to=orm['public.Location'], null=True, blank=True)),
        ))
        db.send_create_signal(u'public', ['Photo'])


    def backwards(self, orm):
        # Deleting model 'Social'
        db.delete_table(u'public_social')

        # Deleting model 'AccountInfo'
        db.delete_table(u'public_accountinfo')

        # Deleting model 'Location'
        db.delete_table(u'public_location')

        # Deleting model 'Payment'
        db.delete_table(u'public_payment')

        # Deleting model 'Vote'
        db.delete_table(u'public_vote')

        # Deleting model 'Comment'
        db.delete_table(u'public_comment')

        # Deleting model 'Photo'
        db.delete_table(u'public_photo')


    models = {
        u'auth.group': {
            'Meta': {'object_name': 'Group'},
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '80'}),
            'permissions': ('django.db.models.fields.related.ManyToManyField', [], {'to': u"orm['auth.Permission']", 'symmetrical': 'False', 'blank': 'True'})
        },
        u'auth.permission': {
            'Meta': {'ordering': "(u'content_type__app_label', u'content_type__model', u'codename')", 'unique_together': "((u'content_type', u'codename'),)", 'object_name': 'Permission'},
            'codename': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'content_type': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['contenttypes.ContentType']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '50'})
        },
        u'auth.user': {
            'Meta': {'object_name': 'User'},
            'date_joined': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'email': ('django.db.models.fields.EmailField', [], {'max_length': '75', 'blank': 'True'}),
            'first_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'groups': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Group']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_active': ('django.db.models.fields.BooleanField', [], {'default': 'True'}),
            'is_staff': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'is_superuser': ('django.db.models.fields.BooleanField', [], {'default': 'False'}),
            'last_login': ('django.db.models.fields.DateTimeField', [], {'default': 'datetime.datetime.now'}),
            'last_name': ('django.db.models.fields.CharField', [], {'max_length': '30', 'blank': 'True'}),
            'password': ('django.db.models.fields.CharField', [], {'max_length': '128'}),
            'user_permissions': ('django.db.models.fields.related.ManyToManyField', [], {'symmetrical': 'False', 'related_name': "u'user_set'", 'blank': 'True', 'to': u"orm['auth.Permission']"}),
            'username': ('django.db.models.fields.CharField', [], {'unique': 'True', 'max_length': '30'})
        },
        u'contenttypes.contenttype': {
            'Meta': {'ordering': "('name',)", 'unique_together': "(('app_label', 'model'),)", 'object_name': 'ContentType', 'db_table': "'django_content_type'"},
            'app_label': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'model': ('django.db.models.fields.CharField', [], {'max_length': '100'}),
            'name': ('django.db.models.fields.CharField', [], {'max_length': '100'})
        },
        u'public.accountinfo': {
            'Meta': {'object_name': 'AccountInfo'},
            'birth_date': ('django.db.models.fields.DateField', [], {'auto_now_add': 'True', 'blank': 'True'}),
            'city': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'country': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_cell': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'is_organizer': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'is_sponsor': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'phone': ('django.db.models.fields.CharField', [], {'max_length': '25', 'null': 'True', 'blank': 'True'}),
            'social_info': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['public.Social']", 'null': 'True', 'blank': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'street': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'user_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"})
        },
        u'public.comment': {
            'Meta': {'object_name': 'Comment'},
            'commentDate': ('django.db.models.fields.DateField', [], {'default': 'datetime.datetime.now'}),
            'commentText': ('django.db.models.fields.CharField', [], {'max_length': '900', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'locationPostID': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['public.Location']"}),
            'locationRating': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"})
        },
        u'public.location': {
            'Meta': {'object_name': 'Location'},
            'city': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'country': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'datecreated': ('django.db.models.fields.DateField', [], {'default': 'datetime.datetime.now'}),
            'description': ('django.db.models.fields.CharField', [], {'max_length': '5000', 'null': 'True', 'blank': 'True'}),
            'eventEndDate': ('django.db.models.fields.DateField', [], {}),
            'eventName': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'eventStartDate': ('django.db.models.fields.DateField', [], {}),
            'forCharity': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'gpsLat': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'gpsLng': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'linkUrl': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'participantCost': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '8', 'decimal_places': '2', 'blank': 'True'}),
            'reliableGPS': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'sponsored': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'starLocation': ('django.db.models.fields.NullBooleanField', [], {'default': 'False', 'null': 'True', 'blank': 'True'}),
            'state': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'street': ('django.db.models.fields.CharField', [], {'max_length': '200', 'null': 'True', 'blank': 'True'}),
            'totalCost': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '9', 'decimal_places': '2', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"}),
            'voteCount': ('django.db.models.fields.IntegerField', [], {'null': 'True', 'blank': 'True'})
        },
        u'public.payment': {
            'Meta': {'object_name': 'Payment'},
            'event_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['public.Location']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'payment_amount': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '9', 'decimal_places': '2', 'blank': 'True'}),
            'payment_type': ('django.db.models.fields.CharField', [], {'max_length': '20'}),
            'sponsor_amount': ('django.db.models.fields.DecimalField', [], {'null': 'True', 'max_digits': '9', 'decimal_places': '2', 'blank': 'True'}),
            'user_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"})
        },
        u'public.photo': {
            'Meta': {'object_name': 'Photo'},
            'eventPostID': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['public.Location']", 'null': 'True', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_profile': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'photo': ('django.db.models.fields.files.ImageField', [], {'max_length': '100', 'null': 'True', 'blank': 'True'}),
            'user': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"})
        },
        u'public.social': {
            'Meta': {'object_name': 'Social'},
            'facebook_url': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            'google_plus': ('django.db.models.fields.URLField', [], {'max_length': '200', 'blank': 'True'}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'twitter_handle': ('django.db.models.fields.CharField', [], {'max_length': '50', 'blank': 'True'}),
            'user_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"})
        },
        u'public.vote': {
            'Meta': {'object_name': 'Vote'},
            'event_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['public.Location']"}),
            u'id': ('django.db.models.fields.AutoField', [], {'primary_key': 'True'}),
            'is_down': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'is_up': ('django.db.models.fields.NullBooleanField', [], {'null': 'True', 'blank': 'True'}),
            'user_id': ('django.db.models.fields.related.ForeignKey', [], {'to': u"orm['auth.User']"})
        }
    }

    complete_apps = ['public']